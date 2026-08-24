chrome.runtime.onInstalled.addListener(() => {
    console.log('JobTrack Extension installed');
});

chrome.runtime.onStartup.addListener(() => {
    chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true
    }).catch(error => {
        console.error(
            'Failed to configure JobTrack side panel:',
            error
        );
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true
    }).catch(error => {
        console.error(
            'Failed to configure JobTrack side panel:',
            error
        );
    });
});