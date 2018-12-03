<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:my="bogo:my"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization"
  xmlns:math="http://www.w3.org/2005/xpath-functions/math"
  xmlns:p="http://www.w3.org/ns/xproc"
  version="3.0"
  xpath-default-namespace="http://www.w3.org/1999/xhtml"
>
  <xsl:param name="json" as="xs:string?"/>
  <xsl:param name="layout" as="xs:string?" select="'yes'"/>

  <xsl:output method="xml" indent="true"/>

  <xsl:template name="create-xpl">
    <xsl:variable name="graph" as="document-node(element(fn:map))" 
      select="json-to-xml(unparsed-text($json))"/>
    <xsl:apply-templates select="$graph" mode="simplify-json-representation">
      <xsl:with-param name="retain-layout" select="$layout = 'yes'" as="xs:boolean" tunnel="yes"/>
    </xsl:apply-templates>
<!--    <xsl:sequence select="$graph"/>-->
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
  
</xsl:stylesheet>