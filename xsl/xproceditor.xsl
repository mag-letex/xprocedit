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

  <!--<xsl:template mode="ixsl:click" match="id('btn_pipe')">
    <xsl:result-document href="#xproc_xml" method="ixsl:replace-content">
      <xsl:call-template name="create-xpl"/> 
    </xsl:result-document>
  </xsl:template>-->
  
  <xsl:template mode="ixsl:click" match="id('downloadlink')">
    <xsl:variable name="pipeline" as="document-node(element(*))">
      <xsl:call-template name="create-xpl"/>
    </xsl:variable>
    <xsl:variable name="url" as="xs:string" 
      select="ixsl:call(ixsl:window(), 
                        'downloadXml', 
                        [
                          serialize($pipeline, $serialization-params), 
                          'downloadlink'
                        ])"/>
    <!-- omit-xml-declaration='no' doesn’t seem to have an effect -->
    <xsl:message select="'Download URL: ', $url"/>
  </xsl:template>

  <xsl:template name="create-xpl">
    <xsl:call-template name="create-xpl-noninteractive">
      <xsl:with-param name="graph-as-json" as="xs:string"
        select="ixsl:eval('JSON.stringify(allPipelines())')"/>
      <xsl:with-param name="retain-layout" select="ixsl:get(id('layout-checkbox',ixsl:page()), 'checked')" 
          as="xs:boolean" tunnel="yes"/>
      <xsl:with-param name="generate-debug-info" select="ixsl:get(id('debug-checkbox',ixsl:page()), 'checked')" 
          as="xs:boolean" tunnel="yes"/>
      <xsl:with-param name="optimize-for-editing" select="ixsl:get(id('optimize-checkbox',ixsl:page()), 'checked')" 
          as="xs:boolean" tunnel="yes"/>
    </xsl:call-template>
  </xsl:template>
  
  
</xsl:stylesheet>