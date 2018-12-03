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
    <xsl:apply-templates select="$graph" mode="simplify-json-representation">
      <xsl:with-param name="retain-layout" select="ixsl:get(id('layout-checkbox',ixsl:page()), 'checked')" 
        as="xs:boolean" tunnel="yes"/>
    </xsl:apply-templates>
    <xsl:sequence select="$graph"/>
  </xsl:template>
  
  
</xsl:stylesheet>