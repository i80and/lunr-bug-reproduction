#!/usr/bin/env node
'use strict'

const fs = require('fs')
const lunr = require('lunr')

function tokenPositionPlugin(builder) {
    // Define a pipeline function that stores the token offset as metadata

    var pipelineFunction = function (token, pos) {
        token.metadata['pos'] = pos
        return token
    }
    lunr.Pipeline.registerFunction(pipelineFunction, 'tokenPositionMetadata')
    builder.pipeline.before(lunr.stemmer, pipelineFunction)
    builder.metadataWhitelist.push('pos')
}

function createIndex(manifest) {
    const index = lunr(function() {
        this.use(tokenPositionPlugin)
        this.field('text')

        for (const doc of manifest.documents) {
            this.add({
                id: doc.slug,
                text: doc.text,
            })
        }
    })

    return index
}

function search(index, queryString) {
    const parsedQuery = queryString.split(/\W/)

    let rawResults = index.query((query) => {
        for (const term of parsedQuery) {
            query.term(term)
            query.term(term)
        }
    })

}

const manifestText = fs.readFileSync('manual-master.json')
const manifestParsed = JSON.parse(manifestText)
const index = createIndex(manifestParsed)

for (let i = 0; i < 100; i += 1) {
    search(index, 'mongodb shutdown unexpected following')
    console.log(index.invertedIndex.mongodb.text['tutorial/recover-data-following-unexpected-shutdown/'].pos.length)
}

