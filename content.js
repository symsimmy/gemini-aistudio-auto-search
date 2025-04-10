console.log('Content script has been injected');

function findAndSetupSlideToggle() {
    console.log('findAndSetupSlideToggle');
    const searchToolElement = document.querySelector('div[data-test-id="searchAsAToolTooltip"]');
    if (searchToolElement) {
        const slideToggleElement = searchToolElement.querySelector('mat-slide-toggle');
        const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');
        const button = document.getElementById(slideToggleElement.id).querySelector('button');
        setTimeout(() => {
            if (slideToggleButton.getAttribute('aria-checked') === 'false') {
                console.log('double check: web search disabled,click to enable');
                button.click();
            }
        }, 20);

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

        const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');
        const button = document.getElementById(slideToggleElement.id).querySelector('button');

        if (slideToggleButton.getAttribute('aria-checked') === 'false') {
            console.log('web search disabled,click to enable');
            button.click();
        }
        return true;
    }
    return false;
}


function findAndSetupButton() {
    return findAndSetupSearchButton();
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
        const existingSearchElement = document.querySelector('div[data-test-id="searchAsAToolTooltip"]');
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