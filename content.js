console.log('Content script has been injected');

function initializeExtension() {
    console.log('Initializing extension...');

    // 创建一个函数来设置按钮的事件监听器
    function setupButtonListener(button) {
        if (!button) {
            console.log('Button is null or undefined');
            return;
        }
        console.log('Setting up click listener for button:', button);
        button.addEventListener('click', function () {
            console.log('Button clicked');
            // 使用 utils.js 中定义的 showToast 函数
            window.showToast('Hello World');
        });
    }

    function findAndSetupButton() {
        const searchToolElement = document.querySelector('div[data-test-id="searchAsAToolTooltip"]');
        if (searchToolElement) {
            console.log('Target button found immediately');

            console.log('Search tool element found');
            const slideToggleElement = searchToolElement.querySelector('mat-slide-toggle');
            if (slideToggleElement) {
                console.log('Slide toggle element found,id:', slideToggleElement.id);
            }

            const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');

            const footerElement = document.querySelector('footer[class="ng-star-inserted"]');
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
                    'disabled' // 注意：只需属性名
                ];

                // mat-mdc-button-persistent-ripple mdc-icon-button__ripple

                attributesToRemove.forEach(attr => {
                    searchButton.removeAttribute(attr);
                });

                footerElement.appendChild(searchElement);

                const imgElement = document.createElement('img');

                // 2. 设置 src 属性
                imgElement.src = 'https://www.gstatic.com/images/branding/productlogos/googleg/v6/24px.svg';
                // 或者使用 setAttribute:
                // imgElement.setAttribute('src', 'https://www.gstatic.com/images/branding/productlogos/googleg/v6/24px.svg');

                // 3. 设置 alt 属性
                imgElement.alt = 'Google logo';

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
                    // 等 10ms
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

    // 首先检查按钮是否已经存在
    if (findAndSetupButton()) {
        return;
    }

    // 如果按钮不存在，创建一个观察器来等待它出现
    console.log('Button not found initially, setting up MutationObserver...');

    const observer = new MutationObserver((mutations, obs) => {
        // console.log('DOM mutation detected, checking for button...');

        // // 记录每次变化的详细信息
        // mutations.forEach(mutation => {
        //     console.log('Mutation type:', mutation.type);
        //     if (mutation.addedNodes.length > 0) {
        //         console.log('Nodes added:', mutation.addedNodes.length);
        //     }
        // });

        if (findAndSetupButton()) {
            console.log('Button found after DOM mutation, disconnecting observer');
            obs.disconnect();
        }
    });

    // 配置观察器
    console.log('Starting MutationObserver...');
    observer.observe(document, { // 改为观察整个 document
        childList: true,
        subtree: true,
        attributes: true, // 也观察属性变化
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