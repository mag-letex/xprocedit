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
      <xsl:call-template name="create-xpl">
      </xsl:call-template>
    </xsl:result-document>
  </xsl:template>

  <xsl:template name="create-xpl">
    <p:declare-step xmlns:p="http://www.w3.org/ns/xproc" xmlns:c="http://www.w3.org/ns/xproc-step"
      version="1.0">
      <p:input port="source" primary="true">
        <p:inline>
          <doc>Hello world!</doc>

        </p:inline>
      </p:input>
      <p:output port="result" primary="true"/>
      <p:identity/>
    </p:declare-step>
  </xsl:template>
  
  

  <xsl:template match="/"/>

  
  
  
  
  
  <xsl:variable name="serialization-params" as="element(output:serialization-parameters)">
    <output:serialization-parameters>
      <output:indent value="yes"/>
    </output:serialization-parameters>
  </xsl:variable>
  
</xsl:stylesheet>