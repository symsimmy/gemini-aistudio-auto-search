console.log('Content script has been injected');

function findAndSetupSlideToggle() {
    console.log('findAndSetupSlideToggle');
    const searchToolElement = document.querySelector('div[data-test-id="searchAsAToolTooltip"]');
    if (searchToolElement) {
        const slideToggleElement = searchToolElement.querySelector('mat-slide-toggle');
        const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');
        const button = document.getElementById(slideToggleElement.id).querySelector('button');

        const imgElement = document.getElementById('web-search-img-element');
        if (imgElement) {
            setTimeout(() => {
                if (slideToggleButton.getAttribute('aria-checked') === 'false' && imgElement.style.filter === 'none') {
                    console.log('double check: web search disabled,click to enable');
                    button.click();
                }
            }, 20);
        }
    }
}

function findAndSetupSearchButton() {
    const searchToolElement = document.querySelector('div[data-test-id="searchAsAToolTooltip"]');
    if (searchToolElement) {
        console.log('Search tool element found');
        const slideToggleElement = searchToolElement.querySelector('mat-slide-toggle');
        if (slideToggleElement) {
            console.log('Slide toggle element found,id:', slideToggleElement.id);
        }

        const footerElement = document.querySelector('footer.ng-star-inserted');
        if (footerElement) {
            console.log('Footer element found');
            const clearElement = footerElement.querySelector('div.menu-wrapper.ng-star-inserted');
            const searchElement = clearElement.cloneNode(true);
            searchElement.id = 'web-search-element';

            const searchButton = searchElement.querySelector('button[mat-ripple-loader-class-name="mat-mdc-button-ripple"]');
            searchButton.classList.remove('mat-mdc-button-disabled');
            const attributesToRemove = [
                'mat-mdc-button-disabled',
                'mat-ripple-loader-uninitialized',
                'mat-ripple-loader-disabled',
                'disabled'
            ];

            attributesToRemove.forEach(attr => {
                searchButton.removeAttribute(attr);
            });

            footerElement.appendChild(searchElement);

            const imgElement = document.createElement('img');
            imgElement.src = 'https://www.gstatic.com/images/branding/productlogos/googleg/v6/24px.svg';
            imgElement.alt = 'Google logo';
            imgElement.id = 'web-search-img-element';


            const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');
            if (slideToggleButton.getAttribute('aria-checked') === 'true') {
                imgElement.style.filter = 'none';
            }
            else {
                imgElement.style.filter = 'grayscale(100%)';
            }

            const matIconElement = searchElement.querySelector('mat-icon');
            matIconElement.replaceWith(imgElement);

            const button = document.getElementById(slideToggleElement.id).querySelector('button');
            button.addEventListener('click', function () {
                // 等 10ms,确保js方法正确执行了
                setTimeout(() => {
                    console.log('click ischecked:', slideToggleButton.getAttribute('aria-checked'));
                    if (slideToggleButton.getAttribute('aria-checked') === 'true') {
                        imgElement.style.filter = 'none';
                    }
                    else {
                        imgElement.style.filter = 'grayscale(100%)';
                    }
                }, 10);
            });

            searchButton.addEventListener('click', function () {
                console.log('searchButton clicked');
                button.click();
            });

            if (slideToggleButton.getAttribute('aria-checked') === 'false') {
                console.log('web search disabled,click to enable');
                searchButton.click();
            }


        }
        return true;
    }
    return false;
}


function findAndSetupButton() {
    const status = findAndSetupSearchButton();
    // findAndSetupSlideToggle();

    return status;
}

function initializeExtension() {
    console.log('Initializing extension...');
    // 首先检查按钮是否已经存在
    if (findAndSetupButton()) {
        return;
    }

    // 如果按钮不存在，创建一个观察器来等待它出现
    console.log('Button not found initially, setting up MutationObserver...');

    const observer = new MutationObserver((mutations, obs) => {
        // 检查是否已存在我们添加的搜索元素
        const existingSearchElement = document.getElementById('web-search-element');
        if (existingSearchElement) {
            // 如果元素已存在但父元素不在 DOM 中，说明页面已更新，需要移除旧元素
            if (!document.body.contains(existingSearchElement)) {
                console.log('existingSearchElement not in DOM, remove it');
                existingSearchElement.remove();
            } else {
                // console.log('existingSearchElement in DOM, return');
                findAndSetupSlideToggle();
                return;
            }
        }

        // 尝试查找和设置按钮
        findAndSetupButton();
        // 注意：这里不再调用 obs.disconnect()
    });

    // 配置观察器
    console.log('Starting MutationObserver...');
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
    });
}

// 确保在页面加载完成后执行
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    console.log('Document already loaded, initializing immediately');
    initializeExtension();
} 