// javascript policy
'use strict';

const downdoc = require('downdoc')

// config options
const asciidocToMarkdownOptions = {
}

// main function
function asciidocToMarkdown(hook, vm) {
    hook.beforeEach(function (content, next) {
        let markdown = ""
        if (!vm.route.file.endsWith(".adoc")) {
            console.debug("File [" + vm.route.file + "] is not asciidoc, continuing...")
            return next(content)
        }
        try {
            console.debug("Initial data below:");
            console.debug(content);
            markdown = downdoc(content, { attributes: { 'markdown-list-indent': 4 } })
            console.debug("markdown converted below:")
            console.debug(markdown)
        } catch (err) {
            console.error(err);
        }
        return next(markdown)
    });
}

// find customPageFooter plugin options
window.$docsify.asciidocToMarkdown = Object.assign(
    asciidocToMarkdownOptions,
    window.$docsify.asciidocToMarkdown,
);

// Set docsify plugin
window.$docsify.plugins = [].concat(
    asciidocToMarkdown,
    window.$docsify.plugins,
);