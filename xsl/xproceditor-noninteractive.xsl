<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:my="bogo:my"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization"
  xmlns:math="http://www.w3.org/2005/xpath-functions/math"
  xmlns:p="http://www.w3.org/ns/xproc"
  version="3.0"
  xpath-default-namespace="http://www.w3.org/1999/xhtml">
  
  <xsl:param name="json" as="item()"/>
  <xsl:param name="layout" as="xs:string?" select="'yes'"/>

  <xsl:output method="xml" indent="true"/>

  <xsl:template name="create-xpl">
    <xsl:variable name="graph" select="json-to-xml(unparsed-text($json))"/>
    <xsl:variable name="simplify-json-representation">
      <xsl:apply-templates select="$graph" mode="simplify-json-representation">
        <xsl:with-param name="retain-layout" select="$layout = 'yes'" as="xs:boolean" tunnel="yes"/>
      </xsl:apply-templates>  
    </xsl:variable>
    
    <xsl:result-document href="file:/C:/cygwin64/home/kraetke/xprocedit/debug.json-graph.xml">
      <xsl:sequence select="$graph"/>
    </xsl:result-document>
    
    <xsl:result-document href="file:/C:/cygwin64/home/kraetke/xprocedit/debug.simplified-rep.xml">
      <xsl:sequence select="$simplify-json-representation"/>
    </xsl:result-document>
    
    <xsl:variable name="xprocify">
      <xsl:apply-templates select="$simplify-json-representation" mode="xprocify"/>  
    </xsl:variable>
    
    <xsl:sequence select="$xprocify"/>
    
    
  </xsl:template>

  <xsl:template match="fn:*[@key]" mode="simplify-json-representation">
    <xsl:variable name="normalized" as="xs:string" select="my:normalize-map-key(@key)"/>
    <xsl:element name="{$normalized}">
      <xsl:if test="not(@key = $normalized)">
        <xsl:attribute name="was" select="@key"/>
      </xsl:if>
      <xsl:apply-templates mode="#current"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="fn:array/fn:*[not(self::fn:map or self::fn:array)]
                                                   [not(@key)]" mode="simplify-json-representation">
    <value>
      <xsl:apply-templates mode="#current"/>
    </value>
  </xsl:template>

  <xsl:template match="fn:*[@key = ('size', 'position', 'angle', 'z', 'attrs', 'markup')]" mode="simplify-json-representation" priority="1">
    <xsl:param name="retain-layout" tunnel="yes" as="xs:boolean?"/>
    <xsl:if test="$retain-layout">
      <xsl:next-match/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="my:normalize-map-key" as="xs:string">
    <xsl:param name="input" as="xs:string"/>
    <xsl:choose>
      <xsl:when test="$input castable as xs:NCName">
        <xsl:sequence select="$input"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="string-join((
                                replace(substring($input, 1, 1), '\I', '_'), 
                                replace(substring($input, 2), '\C', '_')),
                                ''
                              )"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
  
  <xsl:template match="/fn:map" mode="simplify-json-representation" priority="1">
    <doc>
      <xsl:apply-templates mode="#current"/>
    </doc>
  </xsl:template>
  
  <xsl:template match="fn:array[empty(@key)]" mode="simplify-json-representation">
    <anonymous-array>
      <xsl:apply-templates mode="#current"/>
    </anonymous-array>
  </xsl:template>
  
  <xsl:template match="fn:map[empty(@key)]" mode="simplify-json-representation">
    <anonymous-map>
      <xsl:apply-templates mode="#current"/>
    </anonymous-map>
  </xsl:template>
  
  <xsl:variable name="serialization-params" as="element(output:serialization-parameters)">
    <output:serialization-parameters>
      <output:indent value="yes"/>
    </output:serialization-parameters>
  </xsl:variable>
  
  <!--  *
        * xprocify mode 
        * -->
  
  <xsl:key name="options" match="*:anonymous-map[*:type eq 'xproc.Option']"   use="*:parent"/>
  <xsl:key name="connect" match="*:anonymous-map[*:type eq 'devs.StandLink']" use="*:source/*:id"/>
  
  <xsl:template match="//*:anonymous-map[*:type eq 'xproc.Pipeline']" mode="xprocify">
   <p:declare-step xmlns:p="http://www.w3.org/ns/xproc"
                   xmlns:c="http://www.w3.org/ns/xproc-step" version="1.0">
     <xsl:variable name="pipe-id" select="*:stepId" as="xs:ID"/>
     <xsl:variable name="pipe-ports" select="*:portData" as="element()"/>
     <xsl:variable name="pipe-opts" select="key('options', $pipe-id)" as="element()*"/>
     <xsl:variable name="next-step-id" select="key('connect', $pipe-id)/*:target/*:id" as="element()"/>
     <xsl:variable name="next-step" select="//*:anonymous-map[*:type eq 'xproc.Atomic'][*:stepId eq $next-step-id]"/>
     <xsl:apply-templates select="$pipe-ports" mode="xprocify-ports"/>
     <xsl:apply-templates select="$pipe-opts" mode="xprocify-ports">
       <xsl:with-param name="global" select="true()" as="xs:boolean"/>
     </xsl:apply-templates>     
     <xsl:apply-templates select="$next-step" mode="xprocify-next"/>
   </p:declare-step>
 </xsl:template>
  
  <!-- atomic steps -->
  
  <xsl:template match="*:anonymous-map[*:type = ('xproc.Atomic', 'xproc.Compound')]" mode="xprocify-next">
    <xsl:variable name="step-name" as="xs:string" 
                  select="lower-case(replace(replace(*:stepType, '([A-Z])', '-$1'), '^p-', 'p:'))"/>
    <xsl:variable name="step-id" select="*:stepId" as="xs:ID"/>
    <xsl:variable name="step-ports" select="*:portData" as="element()"/>
    <xsl:variable name="step-opts" select="key('options', $step-id)" as="element()*"/>
    <xsl:variable name="next-step-id" select="key('connect', $step-id)/*:target/*:id" as="element()"/>
    <xsl:variable name="next-step" select="//*:anonymous-map[*:type = ('xproc.Atomic', 'xproc.Compound')][*:stepId eq $next-step-id]"/>
    <xsl:element name="{$step-name}">
      <xsl:attribute name="name" select="$step-id"/>
      <xsl:apply-templates select="$step-ports" mode="xprocify-ports"/>
      <xsl:apply-templates select="$step-opts" mode="xprocify-opts"/>
    </xsl:element>
    <xsl:apply-templates select="$next-step" mode="xprocify-next"/>
  </xsl:template>
  
  <!-- input and output ports -->
  
  <xsl:template match="*:portData/*:anonymous-map" mode="xprocify-ports">
    <xsl:variable name="port-type" select="*:portGroup" as="xs:string"/>
    <xsl:variable name="port-name" select="*:portId"/>
    <xsl:variable name="port-primary" select="*:portPrimary" as="xs:string?"/>
    <xsl:variable name="port-sequence" select="*:portSequence" as="xs:string?"/>
    <xsl:element name="{if($port-type eq 'in') then 'p:input' else 'p:output'}">
      <xsl:attribute name="port" select="$port-name"/>
      <xsl:if test="$port-primary">
        <xsl:attribute name="primary" select="$port-primary"/>  
      </xsl:if>
      <xsl:if test="$port-sequence">
        <xsl:attribute name="sequence" select="$port-sequence"/>  
      </xsl:if>
    </xsl:element>
  </xsl:template>
  
  <!-- options -->
  
  <xsl:template match="*:anonymous-map[*:type eq 'xproc.Option']" mode="xprocify-opts">
    <xsl:param name="global" select="false()" as="xs:boolean"/>
    <xsl:element name="{if($global) then 'p:option' else 'p:with-option'}">
      <xsl:attribute name="{*:optionName}" select="*:optionValue"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="@*|*" mode="xprocify" priority="-10">
    <xsl:apply-templates select="*" mode="#current"/>
  </xsl:template>
  
</xsl:stylesheet>