<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:my="bogo:my"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
  xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization"
  xmlns:math="http://www.w3.org/2005/xpath-functions/math"
  xmlns:p="http://www.w3.org/ns/xproc"
  version="3.0"
  extension-element-prefixes="ixsl" 
  xpath-default-namespace="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="#all">

  <xsl:import href="xproceditor-noninteractive.xsl"/>

  <xsl:template match="/"/>

  <xsl:template mode="ixsl:click" match="id('btn_pipe')">
    <xsl:result-document href="#xproc_xml" method="ixsl:replace-content">
      <xsl:call-template name="create-xpl"/> 
    </xsl:result-document>
  </xsl:template>

  <xsl:template name="create-xpl">
    <xsl:variable name="graph" as="document-node(element(fn:map))"
      select="json-to-xml(
                ixsl:eval('JSON.stringify(graphX.toJSON())')
              )"/>
    
    <xsl:variable name="simplify-json-representation">
      <xsl:apply-templates select="$graph" mode="simplify-json-representation">
        <xsl:with-param name="retain-layout" select="ixsl:get(id('layout-checkbox',ixsl:page()), 'checked')" 
          as="xs:boolean" tunnel="yes"/>
      </xsl:apply-templates>
    </xsl:variable>
    
    <xsl:variable name="xprocify">
      <xsl:apply-templates select="$simplify-json-representation" mode="xprocify"/>  
    </xsl:variable>
    
    <xsl:variable name="clean">
      <xsl:apply-templates select="$xprocify" mode="clean"/>  
    </xsl:variable>
    
    <xsl:message select="'########SIMPLIFY: ', $simplify-json-representation"></xsl:message>
    
    <xsl:message select="'########XPROCIFY: ', $xprocify"></xsl:message>
    
    <xsl:sequence select="$clean"/>
    
  </xsl:template>
  
  <xsl:template match="*|@*" mode="clean">
    <xsl:copy copy-namespaces="no">
      <xsl:apply-templates select="@*, node()" mode="clean"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="/*" mode="clean">
    <xsl:copy copy-namespaces="no">
      <xsl:namespace name="p" select="'http://www.w3.org/ns/xproc'"/>
      <xsl:apply-templates select="@*, node()" mode="clean"/>
    </xsl:copy>
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
      
      <xsl:message select="'---------------------', (//*:anonymous-map), ' ///', count(//*:anonymous-map[*:type eq 'xproc.Option']), distinct-values(//*:anonymous-map/*:type)"></xsl:message>
      
      <xsl:variable name="pipe-id" select="*:stepid" as="xs:string"/>
      <xsl:variable name="pipe-ports" select="*:portdata" as="element()"/>
      <xsl:variable name="pipe-opts" select="key('options', $pipe-id)" as="element()*"/>
      <!--<xsl:variable name="pipe-opts" select="//*:anonymous-map[*:type eq 'xproc.Option'][*:parent eq $pipe-id]" as="element()*"/>-->
      <xsl:variable name="next-step-id" select="key('connect', $pipe-id)/*:target/*:id" as="element()"/>
      <xsl:variable name="next-step" select="//*:anonymous-map[*:type eq 'xproc.Atomic'][*:stepid eq $next-step-id]"/>
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
      select="lower-case(replace(replace(*:steptype, '([A-Z])', '-$1'), '^p-', 'p:'))"/>
    <xsl:variable name="step-id" select="*:stepid" as="xs:string"/>
    <xsl:variable name="step-ports" select="*:portdata" as="element()"/>
    <xsl:variable name="step-opts" select="key('options', $step-id)" as="element()*"/>
    <xsl:variable name="prev-step-id" select="key('connect', $step-id)/*:source/*:id" as="xs:string?"/>
    <xsl:variable name="next-step-id" select="key('connect', $step-id)/*:target/*:id" as="element()"/>
    <xsl:variable name="next-step" select="//*:anonymous-map[*:type = ('xproc.Atomic', 'xproc.Compound')][*:stepid eq $next-step-id]"/>
    
    <xsl:element name="{$step-name}">
      <xsl:attribute name="name" select="$step-id"/>
      <xsl:apply-templates select="$step-opts" mode="xprocify-opts"/>
      <!--<xsl:apply-templates select="$step-ports" mode="xprocify-ports">
        <xsl:with-param name="pipe-step-name" select="$prev-step-id" as="xs:string?" tunnel="yes"/>
      </xsl:apply-templates>-->
    </xsl:element>
    <xsl:apply-templates select="$next-step" mode="xprocify-next"/>
  </xsl:template>
  
  <!-- input and output ports -->
  
  <xsl:template match="*:anonymous-map[*:type eq 'xproc.Pipeline']/*:portdata/*:anonymous-map" mode="xprocify-ports">
    <xsl:param name="pipe-step-name" as="xs:string?" tunnel="yes"/>
    <xsl:message select="'-----', $pipe-step-name"></xsl:message>
    <xsl:variable name="port-type" select="*:portgroup" as="xs:string"/>
    <xsl:variable name="port-name" select="*:portid"/>
    <xsl:variable name="port-primary" select="*:portprimary" as="xs:string?"/>
    <xsl:variable name="port-sequence" select="*:portsequence" as="xs:string?"/>
    <xsl:element name="{if($port-type eq 'in') then 'p:input' else 'p:output'}">
      <xsl:attribute name="port" select="$port-name"/>
      <xsl:if test="$port-primary">
        <xsl:attribute name="primary" select="$port-primary"/>  
      </xsl:if>
      <xsl:if test="$port-sequence">
        <xsl:attribute name="sequence" select="$port-sequence"/>  
      </xsl:if>
      <xsl:if test="$pipe-step-name">
        <p:pipe step="{$pipe-step-name}" port="result"/>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  
  <!-- options -->
  
  <xsl:template match="*:anonymous-map[*:type eq 'xproc.Option']" mode="xprocify-opts">
    <xsl:param name="global" select="false()" as="xs:boolean"/>
    <xsl:if test="not(*:optionvalue eq 'unset')">
      <xsl:choose>
        <xsl:when test="$global">
          <p:option name="{*:optionname}" value="{*:optionvalue}"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="{*:optionname}" select="*:optionvalue"/>
        </xsl:otherwise>
      </xsl:choose>  
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="@*|*" mode="xprocify" priority="-10">
    <xsl:apply-templates select="*" mode="#current"/>
  </xsl:template>
  
</xsl:stylesheet>