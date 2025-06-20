console.log('Content script has been injected');

function findAndSetupButton(id,name,async=false) {
    const searchToolElement = document.querySelector(`div[data-test-id="${id}"]`);
    if (searchToolElement) {
        console.log(`${name} tool element found`);
        const slideToggleElement = searchToolElement.querySelector('mat-slide-toggle');
        if (slideToggleElement) {
            console.log(`${name} toggle element found,id:${slideToggleElement.id}`, );
        }

        const slideToggleButton = slideToggleElement.querySelector('button[role="switch"]');
        const button = document.getElementById(slideToggleElement.id).querySelector('button');

        if(async){
            setTimeout(()=>{
                if (slideToggleButton.getAttribute('aria-checked') === 'false') {
                    console.log(`${name} disabled,click to enable`);
                    button.click();
                }
            },20);
        }else{
            if (slideToggleButton.getAttribute('aria-checked') === 'true') {
                console.log(`${name} enabled,click to disable`);
                button.click();
            }
        }
        return true;
    }
    return false;
}

function findAndSetupAllButton(async=false) {
    return findAndSetupButton('searchAsAToolTooltip','web search',async) 
        && findAndSetupButton('browseAsAToolTooltip','url context',async); 
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
                findAndSetupAllButton(true);
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