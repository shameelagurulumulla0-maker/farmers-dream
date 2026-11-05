#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

@interface FarmersDreamApplication : NSObject <NSApplicationDelegate, WKUIDelegate, WKNavigationDelegate>
@property(strong) NSWindow *window;
@property(strong) WKWebView *webView;
@property(strong) NSURL *contentDirectory;
@end

@implementation FarmersDreamApplication
- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    self.contentDirectory = [[NSBundle.mainBundle resourceURL] URLByAppendingPathComponent:@"Web" isDirectory:YES];
    NSURL *index = [self.contentDirectory URLByAppendingPathComponent:@"index.html"];
    if (![NSFileManager.defaultManager fileExistsAtPath:index.path]) {
        NSAlert *alert = [NSAlert new];
        alert.messageText = @"Farmers Dream could not open";
        alert.informativeText = @"Application files are missing. Rebuild or download the complete desktop app.";
        [alert runModal];
        [NSApp terminate:nil];
        return;
    }
    WKWebViewConfiguration *configuration = [WKWebViewConfiguration new];
    configuration.websiteDataStore = WKWebsiteDataStore.defaultDataStore;
    self.webView = [[WKWebView alloc] initWithFrame:NSZeroRect configuration:configuration];
    self.webView.UIDelegate = self;
    self.webView.navigationDelegate = self;
    self.webView.allowsBackForwardNavigationGestures = YES;
    self.window = [[NSWindow alloc] initWithContentRect:NSMakeRect(0, 0, 1280, 860)
        styleMask:NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable
        backing:NSBackingStoreBuffered defer:NO];
    self.window.title = @"Farmers Dream";
    self.window.minSize = NSMakeSize(420, 620);
    self.window.contentView = self.webView;
    [self.window center];
    [self configureMenu];
    [self openHome:nil];
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}
- (void)configureMenu {
    NSMenu *main = [NSMenu new];
    NSMenuItem *appItem = [NSMenuItem new];
    NSMenu *appMenu = [[NSMenu alloc] initWithTitle:@"Farmers Dream"];
    [appMenu addItemWithTitle:@"About Farmers Dream" action:@selector(showAbout:) keyEquivalent:@""];
    [appMenu addItem:NSMenuItem.separatorItem];
    [appMenu addItemWithTitle:@"Quit Farmers Dream" action:@selector(terminate:) keyEquivalent:@"q"];
    appItem.submenu = appMenu;
    [main addItem:appItem];
    NSMenuItem *editItem = [NSMenuItem new];
    NSMenu *edit = [[NSMenu alloc] initWithTitle:@"Edit"];
    NSArray *actions = @[@[@"Undo", @"undo:", @"z"], @[@"Cut", @"cut:", @"x"], @[@"Copy", @"copy:", @"c"], @[@"Paste", @"paste:", @"v"], @[@"Select All", @"selectAll:", @"a"]];
    for (NSArray *action in actions) [edit addItemWithTitle:action[0] action:NSSelectorFromString(action[1]) keyEquivalent:action[2]];
    editItem.submenu = edit;
    [main addItem:editItem];
    NSMenuItem *viewItem = [NSMenuItem new];
    NSMenu *view = [[NSMenu alloc] initWithTitle:@"View"];
    [view addItemWithTitle:@"Marketplace Home" action:@selector(openHome:) keyEquivalent:@"h"];
    [view addItemWithTitle:@"Reload" action:@selector(reloadPage:) keyEquivalent:@"r"];
    [view addItemWithTitle:@"Back" action:@selector(goBack:) keyEquivalent:@"["];
    [view addItemWithTitle:@"Forward" action:@selector(goForward:) keyEquivalent:@"]"];
    viewItem.submenu = view;
    [main addItem:viewItem];
    NSApp.mainMenu = main;
}
- (void)openHome:(id)sender { [self.webView loadFileURL:[self.contentDirectory URLByAppendingPathComponent:@"index.html"] allowingReadAccessToURL:self.contentDirectory]; }
- (void)reloadPage:(id)sender { [self.webView reload]; }
- (void)goBack:(id)sender { if (self.webView.canGoBack) [self.webView goBack]; }
- (void)goForward:(id)sender { if (self.webView.canGoForward) [self.webView goForward]; }
- (void)showAbout:(id)sender {
    [NSApp orderFrontStandardAboutPanelWithOptions:@{
        NSAboutPanelOptionApplicationName: @"Farmers Dream",
        NSAboutPanelOptionApplicationVersion: @"0.1.0",
        NSAboutPanelOptionVersion: @"Local prototype",
        NSAboutPanelOptionCredits: [[NSAttributedString alloc] initWithString:@"Wholesale marketplace for Sri Lanka.\nAccounts, listings and bids remain on this Mac.\nThis is not a live trading service."]
    }];
}
- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender { return YES; }
- (void)webView:(WKWebView *)webView runOpenPanelWithParameters:(WKOpenPanelParameters *)parameters
    initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSArray<NSURL *> * _Nullable))completionHandler {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.allowsMultipleSelection = parameters.allowsMultipleSelection;
    panel.canChooseDirectories = NO;
    panel.canChooseFiles = YES;
    panel.allowedContentTypes = @[UTTypeJPEG, UTTypePNG, UTTypeWebP];
    [panel beginSheetModalForWindow:self.window completionHandler:^(NSModalResponse result) {
        completionHandler(result == NSModalResponseOK ? panel.URLs : nil);
    }];
}
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)action
    decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *url = action.request.URL;
    NSString *root = [self.contentDirectory.URLByResolvingSymlinksInPath.path stringByAppendingString:@"/"];
    if (url.isFileURL && [url.URLByResolvingSymlinksInPath.path hasPrefix:root]) {
        decisionHandler(WKNavigationActionPolicyAllow);
    } else {
        decisionHandler(WKNavigationActionPolicyCancel);
        if (action.navigationType == WKNavigationTypeLinkActivated && [@[@"https", @"http", @"tel"] containsObject:url.scheme.lowercaseString])
            [NSWorkspace.sharedWorkspace openURL:url];
    }
}
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    if (error.code == NSURLErrorCancelled) return;
    NSAlert *alert = [NSAlert new];
    alert.messageText = @"Unable to load Farmers Dream";
    alert.informativeText = error.localizedDescription;
    [alert beginSheetModalForWindow:self.window completionHandler:nil];
}
@end

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        NSApplication *application = NSApplication.sharedApplication;
        FarmersDreamApplication *delegate = [FarmersDreamApplication new];
        application.delegate = delegate;
        [application setActivationPolicy:NSApplicationActivationPolicyRegular];
        [application run];
    }
    return 0;
}
