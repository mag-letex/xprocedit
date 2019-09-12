<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:my="bogo:my"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization"
  xmlns:math="http://www.w3.org/2005/xpath-functions/math"
  xmlns:c="http://www.w3.org/ns/xproc-step"
  xmlns:p="http://www.w3.org/ns/xproc"
  version="3.0"
  xpath-default-namespace="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="math output fn my xs c">
  
  <xsl:param name="json" as="item()"/>
  <xsl:param name="layout" as="xs:string?" select="'false'"/>
  <xsl:param name="optimize" as="xs:string?" select="'true'"/>
  <xsl:param name="debug" as="xs:string?" select="'true'"/>

  <xsl:variable name="xproc-version" as="xs:string" select="'1.0'"/>

  <xsl:output method="xml" indent="true"/>

  <xsl:template name="create-xpl">
    <xsl:call-template name="create-xpl-noninteractive">
      <xsl:with-param name="graph-as-json" select="unparsed-text($json)"/>
      <xsl:with-param name="retain-layout" select="$layout = ('1', 'true', 'yes')" tunnel="yes"/>
      <xsl:with-param name="optimize-for-editing" select="$optimize = ('1', 'true', 'yes')" tunnel="yes"/>
      <xsl:with-param name="generate-debug-info" select="$debug = ('1', 'true', 'yes')" tunnel="yes"/>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template name="create-xpl-noninteractive">
    <xsl:param name="graph-as-json" as="xs:string"/>
    <xsl:param name="retain-layout" as="xs:boolean" select="false()" tunnel="yes"/>
    <xsl:param name="optimize-for-editing" as="xs:boolean" select="true()" tunnel="yes"/>
    <xsl:param name="generate-debug-info" as="xs:boolean" select="false()" tunnel="yes"/>
    
    <xsl:variable name="graph" as="document-node(element(fn:array))"
      select="json-to-xml($graph-as-json)"/>

    <xsl:variable name="simplify-json-representation" as="document-node(element(fn:doc))">
      <xsl:document>
        <xsl:apply-templates select="$graph" mode="simplify-json-representation">
          <!-- can probably omit this explicit param passing -->
          <xsl:with-param name="retain-layout" as="xs:boolean" tunnel="yes" select="$retain-layout"/>
        </xsl:apply-templates>
      </xsl:document>
    </xsl:variable>
    
    <xsl:variable name="xprocify">
      <xsl:apply-templates select="$simplify-json-representation" mode="xprocify">
<!--        <xsl:with-param name="generate-debug-info" as="xs:boolean" select="true()" tunnel="yes"/>-->
      </xsl:apply-templates>  
    </xsl:variable>
    
    <xsl:variable name="clean">
      <xsl:variable name="prelim" as="element(p:declare-step)">
        <xsl:apply-templates select="$xprocify" mode="clean"/>
      </xsl:variable>
      <xsl:for-each select="$prelim">
        <xsl:copy>
          <xsl:copy-of select="@*, node()"/>
          <xsl:if test="$generate-debug-info">
            <p:documentation>Simplified XML representation of the JSON model</p:documentation>
            <p:pipeinfo>
              <xsl:sequence select="$simplify-json-representation"/>
            </p:pipeinfo>
            <p:documentation>JSON</p:documentation>
            <p:pipeinfo>
              <json>
                <xsl:sequence select="$graph-as-json"/>
              </json>
            </p:pipeinfo>

          </xsl:if>
        </xsl:copy>
      </xsl:for-each>
    </xsl:variable>
    
    <xsl:if test="$generate-debug-info">
      <xsl:message select="'########JSON GRAPH: ', $graph-as-json"/>
      <xsl:message select="'########XML GRAPH: ', serialize($graph)"/>
      <xsl:message select="'########SIMPLIFY: ', serialize($simplify-json-representation)"/>
      <xsl:message select="'########XPROCIFY: ', serialize($xprocify)"/>
    </xsl:if>
<!--    <xsl:sequence select="$graph"></xsl:sequence>-->
<!--    <xsl:sequence select="$simplify-json-representation"/>-->
<!--    <xsl:sequence select="$xprocify"/>-->
    <xsl:sequence select="$clean"/>
  </xsl:template>
  
  <xsl:template match="@* | *" mode="simplify-json-representation plan-add-position plan-add-prelim-position xprocify-post"
    xmlns="http://www.w3.org/2005/xpath-functions">
    <xsl:copy>
      <xsl:apply-templates select="@*, node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="fn:*[@key]" mode="simplify-json-representation" xmlns="http://www.w3.org/2005/xpath-functions">
    <xsl:variable name="normalized" as="xs:string" select="my:normalize-map-key(@key)"/>
    <xsl:element name="{$normalized}">
      <xsl:if test="not(@key = $normalized)">
        <xsl:attribute name="was" select="@key"/>
      </xsl:if>
      <xsl:apply-templates mode="#current"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="fn:map[empty(@key)][fn:string[@key = 'type']]" mode="simplify-json-representation" 
    xmlns="http://www.w3.org/2005/xpath-functions" priority="1">
    <xsl:variable name="normalized" as="xs:string" select="my:normalize-map-key(fn:string[@key = 'type'])"/>
    <xsl:element name="{$normalized}">
      <xsl:if test="not(fn:string[@key = 'type'] = $normalized)">
        <xsl:attribute name="was" select="fn:string[@key = 'type']"/>
      </xsl:if>
      <xsl:apply-templates select="* except fn:string[@key = 'type']" mode="#current"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="fn:array/fn:*[not(self::fn:map or self::fn:array)][not(@key)]" 
    mode="simplify-json-representation" xmlns="http://www.w3.org/2005/xpath-functions">
    <value>
      <xsl:apply-templates mode="#current"/>
    </value>
  </xsl:template>

  <xsl:template match="fn:*[@key = ('size', 'position', 'angle', 'z', 'label', 'markup')]" 
    mode="simplify-json-representation" priority="1">
    <xsl:param name="retain-layout" tunnel="yes" as="xs:boolean?"/>
    <xsl:if test="$retain-layout">
      <xsl:next-match/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="fn:map[@key = 'attrs']" mode="simplify-json-representation" priority="1">
    <xsl:param name="retain-layout" tunnel="yes" as="xs:boolean?"/>
    <xsl:variable name="label" as="element(fn:map)?" select="fn:map[@key = '.label']"/>
    <xsl:apply-templates select="$label" mode="#current"/>
    <xsl:if test="$retain-layout">
      <xsl:apply-templates select="* except $label" mode="#current"/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="fn:map[@key = '.label']" mode="simplify-json-representation" priority="1">
    <xsl:apply-templates mode="#current"/>
  </xsl:template>
  
  <xsl:template match="fn:map[@key = ('ports', 'router', 'connector')]" mode="simplify-json-representation" priority="1"/>

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
  
  <xsl:template match="/fn:array | /fn:map" mode="simplify-json-representation" priority="1" 
    xmlns="http://www.w3.org/2005/xpath-functions">
    <doc>
      <xsl:apply-templates mode="#current"/>
    </doc>
  </xsl:template>
  
  <xsl:template match="fn:array[empty(@key)]" mode="simplify-json-representation"
    xmlns="http://www.w3.org/2005/xpath-functions">
    <anonymous-array>
      <xsl:apply-templates mode="#current"/>
    </anonymous-array>
  </xsl:template>
  
  <xsl:template match="fn:map[empty(@key)]" mode="simplify-json-representation"
    xmlns="http://www.w3.org/2005/xpath-functions">
    <anonymous-map>
      <xsl:apply-templates mode="#current"/>
    </anonymous-map>
  </xsl:template>
  
  <xsl:variable name="serialization-params" as="element(output:serialization-parameters)">
    <output:serialization-parameters>
      <output:indent value="yes"/>
      <output:omit-xml-declaration value="no"/>
    </output:serialization-parameters>
  </xsl:variable>
  
  <!--  *
        * xprocify mode 
        * -->
  
  <xsl:key name="options" match="fn:xproc.Option"   use="fn:parent"/>
  <xsl:key name="connect" match="fn:devs.StandLink" use="fn:source/fn:id"/>
  <xsl:key name="connect-target" match="fn:devs.StandLink" use="fn:target/fn:id"/>
  <xsl:key name="step-by-id" match="*[fn:stepId]" use="fn:stepId"/>
  
  <xsl:template match="fn:doc" mode="xprocify">
    <xsl:apply-templates select="fn:anonymous-array/fn:xproc.Pipeline[fn:stepType = 'pipeline']" mode="#current"/>
  </xsl:template>
  
  <xsl:template match="fn:xproc.Pipeline[fn:stepType = 'pipeline']" mode="xprocify">
    <xsl:call-template name="process-subpipeline"/>
  </xsl:template>
  
  <xsl:variable name="subpipeline-element-names" as="xs:string+" 
    select="('xproc.Atomic', 'xproc.Compound', 'xproc.Variable')"/>
  
  <xsl:template name="process-subpipeline">
    <xsl:param name="optimize-for-editing" as="xs:boolean" select="true()" tunnel="yes"/>
    <xsl:param name="generate-debug-info" as="xs:boolean" select="false()" tunnel="yes"/>
    <xsl:variable name="to-be-processed" as="element(*)*" 
      select="key('step-by-id', fn:embeds/fn:value)[local-name() = $subpipeline-element-names]"/>
    <xsl:variable name="plan" as="document-node(element(fn:plan))">
      <xsl:document>
        <plan xmlns="http://www.w3.org/2005/xpath-functions">
          <xsl:for-each-group select="my:plan((., $to-be-processed), fn:stepId)" group-by="@id">
            <xsl:sequence select="."/>
          </xsl:for-each-group>
        </plan>
      </xsl:document>
    </xsl:variable>
    <!-- The intermediate structures look like this:
<plan xmlns="http://www.w3.org/2005/xpath-functions">
  <plan-item id="newPipeline_9938" container="true" pos="1">
    <sort-before target="pAddAttribute_1883" distance="1" pos="2"/>
    <sort-before target="newPipeline_9938" distance="2" pos="3"/>
    <connection target="pAddAttribute_1883" primary="true"/>
  </plan-item>
  <plan-item id="pAddAttribute_1883" pos="2">
    <sort-before target="newPipeline_9938" distance="1" pos="3"/>
    <connection target="newPipeline_9938" primary="true" container="true"/>
  </plan-item>
</plan>

<plan xmlns="http://www.w3.org/2005/xpath-functions">
  <plan-item id="newPipeline_1344" container="true" pos="1"/>
  <plan-item id="pLoad_8768" pos="2">
    <sort-before target="pXslt_9041" distance="1" pos="4"/>
    <sort-before target="newPipeline_1344" distance="2" pos="5"/>
    <connection target="pXslt_9041" primary="true"/>
  </plan-item>
  <plan-item id="pLoad_0200" pos="3">
    <connection target="pXslt_9041"/>
  </plan-item>
  <plan-item id="pXslt_9041" pos="4">
    <sort-before target="newPipeline_1344" distance="1" pos="5"/>
    <connection target="newPipeline_1344" primary="true" container="true"/>
  </plan-item>
</plan>

We sort them according to sort-before[last()]/@pos (or according to @pos as fallback),
with a descending sort by sort-before[last()]/@distance as tie-breaker
    -->
    <xsl:variable name="plan-with-prelim-positions" as="document-node(element(fn:plan))">
      <xsl:document><xsl:apply-templates select="$plan" mode="plan-add-prelim-position"/></xsl:document>
    </xsl:variable>
    <xsl:message select="'PPPPPPPPPPPPPPP ', $plan-with-prelim-positions"></xsl:message>
    <xsl:variable name="plan-with-positions" as="element(fn:plan)">
      <xsl:apply-templates select="$plan-with-prelim-positions" mode="plan-add-position">
        <xsl:with-param name="max-distance" as="xs:integer" tunnel="yes"
          select="xs:integer(max($plan-with-prelim-positions//@ppos))"/>
      </xsl:apply-templates>
    </xsl:variable>
    <xsl:variable name="sorted-plan-items" as="document-node(element(fn:plan))">
      <xsl:document>
        <plan xmlns="http://www.w3.org/2005/xpath-functions" sorted="true">
          <xsl:perform-sort select="$plan-with-positions/*">
            <xsl:sort select="xs:integer((self::fn:plan-item[@container]/@pos,
                                          self::fn:plan-item/fn:sort-before[empty(@primary)][1]/@pos, 
                                          self::fn:plan-item/fn:sort-before[last()]/@pos, 
                                          @pos
                                         )[1])"/>
            <xsl:sort select="xs:integer((self::fn:plan-item/fn:sort-before[empty(@primary)][1]/@distance, 
                                          self::fn:plan-item/fn:sort-before[last()]/@distance, 
                                          0
                                         )[1])" order="descending"/>
            <xsl:sort select="xs:integer(min(for $sb in fn:sort-before[@distance][@pos]
                                          return $sb/@pos - $sb/@distance))"/>
          </xsl:perform-sort>
        </plan>
      </xsl:document>
    </xsl:variable>
    <xsl:message select="'SSSSSSSSSS ', $sorted-plan-items"></xsl:message>
    <!--<xsl:message select="'HHHHHHHHHHHHH ',for $p in $plan-with-positions/* return string-join(($p/@id, 
      'a:',$p/self::fn:plan-item[empty(@container)]/fn:sort-before[empty(@primary)][1]/@pos,
      'b:',$p/fn:sort-before[last()]/@pos,
      'c:',$p/@pos,
      'd:',min(for $sb in $p/fn:sort-before[@distance][@pos]
                                          return $sb/@pos - $sb/@distance)), ' :: ')"></xsl:message>-->
    <xsl:if test="$generate-debug-info">
      <xsl:message select="'SORTED PLAN:', $sorted-plan-items"></xsl:message>
    </xsl:if>
    <!-- Watch out: Now the “plan” is transformed in xprocify mode! -->
    <xsl:variable name="plan" as="document-node(element(fn:plan))">
      <xsl:choose>
        <xsl:when test="$optimize-for-editing">
          <xsl:sequence select="$sorted-plan-items"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:document>
            <xsl:sequence select="$plan-with-positions"/>
          </xsl:document>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:apply-templates select="$plan/fn:plan/fn:plan-item[@container]" mode="#current">
      <xsl:with-param name="simplified-graph" select="root(.)" as="document-node(element(fn:doc))" tunnel="yes"/>
      <xsl:with-param name="plan" as="document-node(element(fn:plan))" tunnel="yes" select="$plan"/>
      <xsl:with-param name="container-id" select="fn:stepId" tunnel="yes" as="xs:string"/>
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template match="fn:plan-item[@container]" mode="xprocify">
    <xsl:param name="optimize-for-editing" as="xs:boolean?" tunnel="yes"/>
    <xsl:param name="simplified-graph" as="document-node(element(fn:doc))" tunnel="yes"/>
    <xsl:param name="container-id" as="xs:string" tunnel="yes"/>
    <xsl:param name="generate-debug-info" as="xs:boolean?" tunnel="yes"/>
    <xsl:variable name="corresponding" as="element(*)" 
      select="key('step-by-id', @id, $simplified-graph)[fn:stepId = $container-id]/self::fn:xproc.Pipeline"/>
    <xsl:variable name="step-name" as="xs:string" select="@id"/>
    <xsl:variable name="prelim" as="element(*)">
      <xsl:element name="{($corresponding/fn:text, 'p:declare-step')[1]}">
        <xsl:if test="empty($corresponding/fn:text)">
          <xsl:attribute name="version" select="$xproc-version"/>
          <xsl:attribute name="name" select="$corresponding/fn:stepId"/>
        </xsl:if>
        <xsl:apply-templates select="$corresponding/fn:portData" mode="#current"/>
        <xsl:apply-templates select="key('options', $corresponding/fn:stepId, $simplified-graph)
                                       [fn:paren = $container-id]" mode="#current">
          <xsl:with-param name="global" select="exists($corresponding/self::fn:xproc.Pipeline/fn:stepType[. = 'pipeline'])"
            as="xs:boolean"/>
        </xsl:apply-templates>
        <xsl:apply-templates select="following-sibling::*[1]" mode="#current"/>
        
      </xsl:element>
    </xsl:variable>
    <xsl:apply-templates select="$prelim" mode="xprocify-post">
      <xsl:with-param name="step-name" select="$step-name" tunnel="yes"/>
      <xsl:with-param name="pipeinfo" as="element(*)*" tunnel="yes">
        <xsl:if test="$generate-debug-info">
          <p:documentation>Ordering plan</p:documentation>
          <p:pipeinfo>
            <xsl:sequence select="root(.)"/>
          </p:pipeinfo>
        </xsl:if>
      </xsl:with-param>
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template match="fn:plan-item[empty(@container)]" mode="xprocify">
    <xsl:param name="simplified-graph" as="document-node(element(fn:doc))" tunnel="yes"/>
    <xsl:param name="container-id" as="xs:string" tunnel="yes"/>
    <xsl:variable name="corresponding" as="element(*)" 
      select="key('step-by-id', @id, $simplified-graph)[fn:parent = $container-id]"/>
    <xsl:element name="{($corresponding/fn:text, 'p:declare-step')[1]}">
      <xsl:attribute name="name" select="@id"/>
      <xsl:apply-templates select="key('options', @id, $simplified-graph)" mode="#current"/>
      <xsl:apply-templates select="$corresponding/fn:portData" mode="#current"/>
      <xsl:call-template name="connections">
        <xsl:with-param name="connections" as="element(fn:devs.StandLink)*"
          select="key('connect-target', $corresponding/fn:stepId, $simplified-graph)[not(my:is-primary-connection(.))]
                     [fn:parent = $container-id]"/>
      </xsl:call-template>
      <xsl:if test="$corresponding/fn:text = 'p:xslt' and $xproc-version = '1.0'">
        <!-- preliminary -->
        <p:input port="parameters"><p:empty/></p:input>
      </xsl:if>
      <xsl:variable name="subpipeline" as="element(fn:xproc.Pipeline)?" 
      select="key('step-by-id', @id, $simplified-graph)/self::fn:xproc.Pipeline"/>
      <xsl:variable name="step-name" as="xs:string" select="@id"/>
      <xsl:for-each select="$subpipeline">
        <xsl:variable name="prelim" as="element(*)">
          <xsl:call-template name="process-subpipeline"/>
        </xsl:variable>
        <xsl:apply-templates select="$prelim" mode="xprocify-post">
          <xsl:with-param name="step-name" select="$step-name" tunnel="yes"/>
        </xsl:apply-templates>
      </xsl:for-each>
    </xsl:element>
    <xsl:if test="empty(fn:connection/@primary) 
                  and 
                  $corresponding/fn:portData/fn:anonymous-map[fn:portGroup = 'out']/fn:portPrimary = 'true'">
      <p:sink/>
    </xsl:if>
    <xsl:apply-templates select="following-sibling::*[1]" mode="#current"/>
  </xsl:template>
  
  <xsl:template match="@primary[.='unset'] | @sequence[.='unset']" mode="xprocify-post"/>
  
  <xsl:template match="p:viewport/p:input[@port = '[source]'][empty(p:pipe)]" mode="xprocify-post" priority="1"/>

  <xsl:template match="p:viewport/p:input[@port = '[source]']" mode="xprocify-post">
    <xsl:element name="{if (xs:decimal($xproc-version) >= 3) then 'p:with-input' else 'p:viewport-source'}">
      <xsl:apply-templates mode="#current"/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="p:for-each[empty(@name)] | p:viewport[empty(@name)]" mode="xprocify-post" priority="-1">
    <xsl:apply-templates mode="#current"/>
  </xsl:template>
  
  <xsl:template match="p:for-each/p:input" mode="xprocify-post"/>
  
  <xsl:template match="p:for-each/*/*[name() = ('p:input', 'p:with-input')][p:pipe/@step]" mode="xprocify-post" priority="2">
    <xsl:param name="step-name" as="xs:string" tunnel="yes"/>
    <xsl:if test="not(p:pipe/@step = $step-name)">
      <xsl:next-match/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="*[empty(..)]" mode="xprocify-post">
    <xsl:param name="pipeinfo" as="element(*)*" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@*, node()" mode="#current"/>
      <xsl:sequence select="$pipeinfo"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="*[empty(..)][empty(*[last()]/self::p:sink)]
                          /p:output[@primary = 'true'][count(p:pipe) = 1]/p:pipe" mode="xprocify-post"/>

  <xsl:template match="*[empty(..)][empty(*[last()]/self::p:sink)]
                          [p:output[@primary = 'true'][count(p:pipe) gt 1]]/*[last()]" mode="xprocify-post">
    <xsl:next-match/>
    <p:sink/>
  </xsl:template>

  
  <xsl:template match="p:for-each/p:input" mode="clean">
    <p:iteration-source>
      <xsl:apply-templates mode="#current"/>
    </p:iteration-source>
  </xsl:template>
  
  <xsl:template match="p:*/@*[. = 'unset']" mode="clean"/>
    
  
  
  <xsl:template name="connections">
    <xsl:param name="connections" as="element(fn:devs.StandLink)*"/>
    <xsl:for-each-group select="$connections" group-by="fn:target/fn:port">
      <xsl:element name="{if (xs:decimal($xproc-version) >= 3) then 'p:with-input' else 'p:input'}">
        <xsl:attribute name="port" select="fn:current-grouping-key()"/>
        <xsl:for-each select="current-group()">
          <p:pipe step="{fn:source/fn:id}" port="{fn:source/fn:port}"/>      
        </xsl:for-each>
      </xsl:element>
    </xsl:for-each-group>
  </xsl:template>
  
  
  <xsl:template match="fn:plan-item" mode="plan-add-position">
    <xsl:param name="max-distance" tunnel="yes" as="xs:integer"/>
    <xsl:copy>
      <xsl:apply-templates select="@*" mode="#current"/>
      <xsl:attribute name="pos" select="$max-distance - xs:integer(@ppos)"/>
      <xsl:if test="fn:connection(:[@primary = 'foo']:)">
        <xsl:sequence select="my:plan-distance(., 1, $max-distance)"/>
      </xsl:if>
      <xsl:apply-templates mode="#current"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="fn:plan-item" mode="plan-add-prelim-position">
    <xsl:copy>
      <xsl:attribute name="ppos" select="my:distance-to-end(., 0, (), 0)"/>
      <xsl:apply-templates select="@*" mode="#current"/>
      <xsl:apply-templates mode="#current"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:function name="my:distance-to-end" as="xs:integer">
    <xsl:param name="plan-item" as="element(fn:plan-item)"/>
    <xsl:param name="current" as="xs:integer"/>
    <xsl:param name="seen" as="element(fn:plan-item)*"/>
    <xsl:param name="iteration" as="xs:integer"/>
    <xsl:variable name="connected-to" as="element(fn:plan-item)*" 
      select="key('plan-by-id', $plan-item/fn:connection/@target, root($plan-item))"/>
    <xsl:choose>
      <xsl:when test="some $pi in $seen satisfies ($pi is $plan-item)">
        <xsl:sequence select="$current"/>
      </xsl:when>
      <xsl:when test="$iteration gt 20">
        <xsl:sequence select="$current"/>
      </xsl:when>
      <xsl:when test="exists($connected-to)">
        <xsl:variable name="vals" as="xs:integer+">
          <xsl:for-each select="$connected-to">
            <xsl:sequence select="my:distance-to-end(., $current + 1, ($seen, $plan-item), $iteration + 1)"/>
          </xsl:for-each>
        </xsl:variable>
        <xsl:sequence select="xs:integer(max($vals))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$current"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
  
  <xsl:function name="my:plan-distance" as="element(fn:sort-before)*">
    <xsl:param name="plan-item" as="element(fn:plan-item)"/>
    <xsl:param name="distance" as="xs:integer"/>
    <xsl:param name="max-distance" as="xs:integer"/>
    <xsl:variable name="connected-to" as="element(fn:plan-item)*" 
      select="key('plan-by-id', $plan-item/fn:connection(:[@primary = 'foo']:)/@target, root($plan-item))"/>
    <xsl:for-each select="$connected-to">
      <sort-before target="{@id}" distance="{$distance}" xmlns="http://www.w3.org/2005/xpath-functions">
        <xsl:attribute name="pos" select="$max-distance - xs:integer(@ppos)"/>
        <xsl:copy-of select="$plan-item/fn:connection[@target = current()/@id]/@primary"/>
        <xsl:if test="@container">
          <xsl:attribute name="pos" select="$max-distance"/>
        </xsl:if>
      </sort-before>
      <xsl:if test=".[not(@container)]/fn:connection[@primary]">
        <xsl:sequence select="my:plan-distance(., $distance + 1, $max-distance)"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:function>
  
  <xsl:key name="plan-by-id" match="fn:plan-item" use="@id"/>
  
  <xsl:function name="my:index-of" as="xs:integer">
    <xsl:param name="seq" as="node()*"/>
    <xsl:param name="srch" as="node()*"/>
    <xsl:sequence select="index-of($seq/generate-id(), $srch/generate-id())"/>
  </xsl:function>
  
  <xsl:function name="my:plan" as="element(fn:plan-item)*">
    <!-- will be called for fn:xproc.Pipeline -->
    <xsl:param name="immediates" as="element(*)*"/>
    <xsl:param name="container-id" as="xs:string"/>
    <xsl:for-each select="$immediates">
      <plan-item xmlns="http://www.w3.org/2005/xpath-functions" id="{fn:stepId}">
        <xsl:if test="fn:stepId = $container-id">
          <xsl:attribute name="container" select="'true'"/>
        </xsl:if>
        <xsl:for-each select="key('connect', fn:stepId)[(fn:parent, fn:stepId)[1] = $container-id]">
          <connection target="{fn:target/fn:id}">
            <xsl:if test="my:is-primary-connection(.)">
              <xsl:attribute name="primary" select="'true'"/>
            </xsl:if>
            <xsl:if test="fn:target/fn:id = $container-id">
              <xsl:attribute name="container" select="'true'"/>
            </xsl:if>
          </connection>
        </xsl:for-each>
      </plan-item>
    </xsl:for-each>
    <xsl:if test="exists($immediates)">
      <xsl:variable name="next" as="element(*)*" 
        select="key('connect', $immediates[not(fn:stepId = $container-id)]/fn:stepId, root($immediates[1]))
                  [not(fn:target/fn:id = $container-id)]
                  [fn:parent = $container-id]"/>
      <xsl:sequence select="my:plan(key('step-by-id', $next/fn:target/fn:id, root($immediates[1])), $container-id)"/>  
    </xsl:if>
  </xsl:function>

  <xsl:function name="my:portData-for-linkEnd" as="element(fn:anonymous-map)?">
    <xsl:param name="source-or-target" as="element()"/>
    <xsl:variable name="step" as="element(*)?"
      select="key('step-by-id', $source-or-target/fn:id, root($source-or-target))
                 [(fn:parent, fn:stepId)[1] = $source-or-target/../fn:parent]"/><!-- xproc.Pipeline, xproc.Atomic, xproc.Compound -->
    <xsl:sequence select="$step/fn:portData/fn:anonymous-map[fn:portId = $source-or-target/fn:port]"/>
  </xsl:function>
  
  <xsl:function name="my:is-primary-connection" as="xs:boolean">
    <xsl:param name="connection" as="element(fn:devs.StandLink)"/>
    <xsl:sequence select="my:portData-for-linkEnd($connection/fn:target)/fn:portPrimary = 'true'
                          and
                          my:portData-for-linkEnd($connection/fn:source)/fn:portPrimary = 'true'"/>
  </xsl:function>
  
  <xsl:function name="my:has-primary-connection" as="xs:boolean">
    <xsl:param name="elt" as="element(*)"/><!-- xproc.Pipeline, xproc.Atomic, xproc.Compound -->
    <xsl:sequence select="exists(key('connect', $elt/fn:stepId, root($elt))[my:is-primary-connection(.)])"/>
  </xsl:function>

  <!-- input and output ports -->
  
  <xsl:template match="fn:xproc.Pipeline/fn:portData/fn:anonymous-map" mode="xprocify" priority="1">
    <xsl:param name="pipe-step-name" as="xs:string?" tunnel="yes"/>
    <xsl:param name="plan" as="document-node(element(fn:plan))" tunnel="yes"/>
    <xsl:param name="simplified-graph" as="document-node(element(fn:doc))" tunnel="yes"/>
    <xsl:variable name="port-type" select="fn:portGroup" as="xs:string"/>
    <xsl:variable name="port-name" select="fn:portId"/>
    <xsl:variable name="port-primary" as="xs:string"
      select="(fn:portPrimary, 
               'true'[count(current()/../fn:anonymous-map[fn:portGroup = $port-type]) = 1]
              )[1]"/>
    <xsl:variable name="port-sequence" select="fn:portSequence" as="xs:string?"/>
    <xsl:element name="{if($port-type eq 'in') then 'p:input' else 'p:output'}">
      <xsl:attribute name="port" select="$port-name"/>
      <xsl:if test="$port-primary">
        <xsl:attribute name="primary" select="$port-primary"/>
        <xsl:if test="$port-sequence">
          <xsl:attribute name="sequence" select="$port-sequence"/>
        </xsl:if>
        <xsl:if test="$port-type = 'out'">
          <xsl:variable name="container" as="element(fn:plan-item)"
            select="$plan/fn:plan/fn:plan-item[@container]"/>
          <xsl:variable name="out-connections" as="element(p:input)*">
            <xsl:call-template name="connections">
              <xsl:with-param name="connections" as="element(fn:devs.StandLink)*"
                select="key('connect-target', $container/@id, $simplified-graph)[fn:parent = $container/@id]"/>
            </xsl:call-template>  
          </xsl:variable>
          <xsl:sequence select="$out-connections[@port = $port-name]/p:pipe"/>
        </xsl:if>
      </xsl:if>
      <xsl:if test="$pipe-step-name">
        <!-- What is this? -->
        <p:pipe step="{$pipe-step-name}" port="result"/>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  
  <!-- options -->
  
  <xsl:template match="fn:xproc.Option" mode="xprocify">
    <xsl:param name="global" select="false()" as="xs:boolean"/>
    <xsl:variable name="computed-xpath-regexx" as="xs:string" select="'^\{([^}]+)\}$'"/>
    <xsl:if test="not(fn:optionValue eq 'unset')">
      <xsl:choose>
        <xsl:when test="$global">
          <xsl:choose>
            <xsl:when test="matches(fn:optionValue, $computed-xpath-regexx)">
              <p:option name="{fn:optionName}">
                <xsl:attribute name="select" select="replace(fn:optionValue, $computed-xpath-regexx, '$1')"/>
              </p:option>
            </xsl:when>
            <xsl:otherwise>
              <p:option name="{fn:optionName}" select="{'''' || . || ''''}"/>
            </xsl:otherwise>
          </xsl:choose>    
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="matches(fn:optionValue, $computed-xpath-regexx)">
              <p:with-option name="{fn:optionName}">
                <xsl:attribute name="select" select="replace(fn:optionValue, $computed-xpath-regexx, '$1')"/>
              </p:with-option>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="{fn:optionName}" select="fn:optionValue"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="@*|*" mode="xprocify" priority="-10">
    <xsl:apply-templates select="*" mode="#current"/>
  </xsl:template>
  
  <xsl:template match="*|@*" mode="clean">
    <xsl:copy copy-namespaces="no">
      <xsl:apply-templates select="@*, node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="/*" mode="clean">
    <xsl:copy copy-namespaces="no">
      <xsl:namespace name="p" select="'http://www.w3.org/ns/xproc'"/>
      <xsl:namespace name="c" select="'http://www.w3.org/ns/xproc-step'"/>
      <xsl:apply-templates select="@*, node()" mode="clean"/>
    </xsl:copy>
  </xsl:template>
  

</xsl:stylesheet>