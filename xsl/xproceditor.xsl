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
>

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
    <xsl:apply-templates select="$graph" mode="simplify-json-representation"/>
    <xsl:sequence select="$graph"/>
  </xsl:template>
  
  <xsl:template match="fn:*[@key]" mode="simplify-json-representation">
    <xsl:element name="{my:normalize-map-key(@key)}">
      <xsl:apply-templates mode="#current"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:function name="my:normalize-map-key" as="xs:string">
    <xsl:param name="input" as="xs:string"/>
    <xsl:choose>
      <xsl:when test="$input castable as xs:NCName">
        <xsl:sequence select="$input"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="string-join(
                                replace(substring($input, 1, 1), '\I', '_'), 
                                replace(substring($input, 2), '\C', '_')
                              )"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
  
  <xsl:template match="/fn:map" mode="simplify-json-representation">
    <doc>
      <xsl:apply-templates mode="#current"/>
    </doc>
  </xsl:template>
  

  

  <xsl:template match="/"/>

  
  
  
  
  
  <xsl:variable name="serialization-params" as="element(output:serialization-parameters)">
    <output:serialization-parameters>
      <output:indent value="yes"/>
    </output:serialization-parameters>
  </xsl:variable>
  
</xsl:stylesheet>