// javascript policy
'use strict';

const downdoc = require('downdoc')
const turndown = require('turndown')

import TurndownService from "turndown"

// config options
const docsifyAsciidocOptions = {
    asciidoctorEnabled: false,
    asciidoctorProcessor: undefined,
    downdocAttributes: undefined,
    ext: '.adoc',
    debug: false,
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
                debug("using asciidoctor instance")
                data = asciidoctor.convert(content)
                debug("instantiating turndown")
                markdown = TurndownService().turndown(data)
            } else {
                debug("using embedded converted")
                markdown = downdoc(content, docsifyAsciidocOptions.downdocAttributes)
            }
        } catch (err) {
            console.error(err);
        }
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