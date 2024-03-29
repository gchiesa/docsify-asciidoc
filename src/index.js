// javascript policy
'use strict';

const downdoc = require('downdoc')
const turndown = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')

const gfm = turndownPluginGfm.gfm
const tables = turndownPluginGfm.tables
const strikethrough = turndownPluginGfm.strikethrough
const taskListItems = turndownPluginGfm.taskListItems

import TurndownService from "turndown"

// config options
const docsifyAsciidocOptions = {
    asciidoctorEnabled: false,
    asciidoctorProcessor: undefined,
    downdocAttributes: undefined,
    ext: '.adoc',
    debug: false,
    turndownOptions: {codeBlockStyle: "fenced"},
    turndownKeep: ["table", "tr", "td"],
    turndownPluginGfmCapabilities: ["strikethrough", "tables", "taskListItems"],
    debugDumpIntermediateHTML: false,
    debugDumpGeneratedMarkdown: false
}

function setTurndownPlugins(turndownInstance, pluginList) {
    if (pluginList.includes("strikethrough")) {
        turndownInstance().use(strikethrough)
    }
    if (pluginList.includes("tables")) {
        turndownInstance().use(tables)
    }
    if (pluginList.includes("taskListItems")) {
        turndownInstance().use(taskListItems)
    }
    if (pluginList.includes("gfm")) {
        turndownInstance().use(gfm)
    }
    return turndownInstance
}

function registerAsciidoctorKroki(asciidoctor) {
    try {
        const registry = asciidoctor.Extensions.create()
        AsciidoctorKroki.register(registry)
        debug("registered asciidoctor-kroki extension")
        return registry
    } catch (err) {
        debug("asciidoctor-kroki extension not found")
    }
    return undefined
}

// main function
function docsifyAsciidoc(hook, vm) {
    hook.beforeEach(function (content, next) {
        let markdown = ""
        if (!vm.route.file.endsWith(docsifyAsciidocOptions.ext)) {
            debug("file [" + vm.route.file + "] is not asciidoc, continuing...")
            debug("content" + content)
            return next(content)
        }
        try {
            let data = ""
            debug("converting asciidoc to markdown")
            if (docsifyAsciidocOptions.asciidoctorEnabled) {
                let asciidoctor = (docsifyAsciidocOptions.asciidoctorProcessor !== undefined) ? docsifyAsciidocOptions.asciidoctorProcessor : Asciidoctor()
                let registry = registerAsciidoctorKroki(asciidoctor)

                debug("using asciidoctor instance")
                data = asciidoctor.convert(content, {safe: 'safe', extension_registry: registry})
                debug("instantiating turndown")
                let tds = TurndownService
                if (docsifyAsciidocOptions.turndownPluginGfmCapabilities.length) {
                    debug("using turndown-plugin-gfm capabilities: " + docsifyAsciidocOptions.turndownPluginGfmCapabilities)
                    tds = setTurndownPlugins(tds, docsifyAsciidocOptions.turndownPluginGfmCapabilities)
                }
                if (docsifyAsciidocOptions.debugDumpIntermediateHTML)
                    debug("html data: " + data)
                markdown = tds(docsifyAsciidocOptions.turndownOptions).keep(docsifyAsciidocOptions.turndownKeep).turndown(data)
            } else {
                debug("using embedded converted")
                markdown = downdoc(content, docsifyAsciidocOptions.downdocAttributes)
            }
        } catch (err) {
            console.error(err);
        }
        if (docsifyAsciidocOptions.debugDumpGeneratedMarkdown)
            debug("generated markdown: " + markdown)
        return next(markdown)
    });
}

function debug(msg) {
    if (docsifyAsciidocOptions.debug) console.log('[docsifyAsciidoc] log: ' + msg);
}

// find asciidocToMarkdown plugin options
window.$docsify.docsifyAsciidoc = Object.assign(
    docsifyAsciidocOptions,
    window.$docsify.docsifyAsciidoc,
);

// Set docsify plugin
window.$docsify.plugins = [].concat(
    docsifyAsciidoc,
    window.$docsify.plugins,
);
