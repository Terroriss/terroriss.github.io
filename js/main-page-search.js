var lunrIndex, pagesIndex;
pagesIndex = [
    {
        "index": "1",
        "title": "Markdown Cơ Bản",
        "tags": ["markdown", "syntax", "purple-se"]
    }, 
    {
        "index": "2",
        "title": "Python Cơ Bản",
        "tags": ["python", "syntax", "purple-se"]
    }, 
    {
        "index": "3",
        "title": "Cheat Sheets",
        "tags": ["markdown", "syntax", "blue-se"]
    }, 
]

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Initialize lunrjs using our generated index file
function initLunr() {
    lunrIndex = lunr(function() {
                this.ref("title");
                this.field('tags');
				
                this.pipeline.remove(lunr.stemmer);
                this.searchPipeline.remove(lunr.stemmer);
				pagesIndex.forEach(function (doc) {
                    this.add(doc)
                }, this)
            })
    
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(queryTerm) {
    // Find the item in our index corresponding to the lunr one to have more info
    return lunrIndex.search(queryTerm+"^100"+" "+queryTerm+"*^10"+" "+"*"+queryTerm+"^10"+" "+queryTerm+"~2^1").map(function(result) {
            return pagesIndex.filter(function(page) {
                return page.title === result.ref;
            })[0];
        });
}

function show_all_hidden() {
    var container = document.querySelector(".container");
    var links = container.querySelectorAll(".article-block")
    for (let i = 0, len = links.length; i < len; ++i) {
        links[i].classList.remove("hidden");
    }
}

// Let's get started
initLunr();
$( document ).ready(function() {
    document.querySelector("#search-by").addEventListener("input", function() {
        var value = this.value;
        if (value === "") show_all_hidden();
        else {
            var search_result = search(value);
            var container = document.querySelector(".container");
            var result_index = [];
            search_result.forEach(function(res) {
                result_index.push(res.index);
            })
            var links = container.querySelectorAll(".article-block");
            for (let i = 0, len = links.length; i < len; ++i) {
                let curr = links[i];
                if (result_index.includes(curr.dataset.index))
                    curr.classList.remove("hidden");
                else
                    curr.classList.add("hidden");
            }
        }
    })
    
    var ajax;
    jQuery('[data-search-input]').on('input', function() {
        var input = jQuery(this),
            value = input.val(),
            items = jQuery('[data-nav-id]');
        items.removeClass('search-match');
        if (!value.length) {
            $('ul.topics').removeClass('searched');
            items.css('display', 'block');
            sessionStorage.removeItem('search-value');
            $(".highlightable").unhighlight({ element: 'mark' })
            return;
        }

        sessionStorage.setItem('search-value', value);
        $(".highlightable").unhighlight({ element: 'mark' }).highlight(value, { element: 'mark' });

        if (ajax && ajax.abort) ajax.abort();

        jQuery('[data-search-clear]').on('click', function() {
            jQuery('[data-search-input]').val('').trigger('input');
            sessionStorage.removeItem('search-input');
            $(".highlightable").unhighlight({ element: 'mark' });
            show_all_hidden();
        });
    });          
    $(".highlightable").highlight(sessionStorage.getItem('search-value'), { element: 'mark' });
    
//    var searchList = new autoComplete({
//        /* selector for the search box element */
//        selector: $("#search-by").get(0),
//        /* source is the callback to perform the search */
//        source: function(term, response) {
//            response(search(term));
//        },
//        /* renderItem displays individual search results */
//        renderItem: function(item, term) {
//            var divcontext = document.createElement("div");
//            divcontext.className = "context";
//            divcontext.innerText = item.tags ? "Tags: " + item.tags : "";
//            var divsuggestion = document.createElement("div");
//            divsuggestion.className = "autocomplete-suggestion";
//            divsuggestion.setAttribute("data-term", term);
//            divsuggestion.setAttribute("data-title", item.title);
//            divsuggestion.setAttribute("data-index", item.index);
//            divsuggestion.setAttribute("data-uri", item.uri);
//            divsuggestion.setAttribute("data-tags", item.tags);
//            divsuggestion.innerText = '» ' + item.title;
//            divsuggestion.appendChild(divcontext);
//            return divsuggestion.outerHTML;
//        },
//        /* onSelect callback fires when a search suggestion is chosen */
//        onSelect: function(e, term, item) {
//            location.href = item.getAttribute('data-uri');
//        }
//    });
});


jQuery.extend({
    highlight: function(node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function(options) {
    var settings = {
        className: 'highlight',
        element: 'span'
    };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function() {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function(words, options) {
    var settings = {
        className: 'highlight',
        element: 'span',
        caseSensitive: false,
        wordsOnly: false
    };
    jQuery.extend(settings, options);

    if (!words) { return; }

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i) {
        return word != '';
    });
    words = jQuery.map(words, function(word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; }
    ;

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function() {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};
