//
//  AppDelegate.m
//  PushHandle
//
//  Created by 张桂杨 on 2017/3/14.
//  Copyright © 2017年 DD. All rights reserved.
//
/*
 {"aps":{"alert":{"loc-args":["Arms","Arms"],"loc-key":"pushkey"},"badge":1,"category":"Category1","content-available":1},"a":"cw://notification/list","t":"2","u":"http://www.baidu.com"}
 
 */
#import "AppDelegate.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


	
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	// Override point for customization after application launch.
	[self registerForRemoteNotifications];
	
	
	return YES;
}
	
	
	
	
#pragma mark - RemoteNotification
#pragma mark ---推送设置
- (void)registerForRemoteNotifications {
	[[UIApplication sharedApplication] registerForRemoteNotifications];
	UIMutableUserNotificationAction * action1 = [[UIMutableUserNotificationAction alloc] init];
	action1.identifier = @"action1";
	action1.title=@"忽略";
	action1.behavior = UIUserNotificationActionBehaviorDefault; // 操作类型，默认按钮
	action1.activationMode = UIUserNotificationActivationModeBackground; // 后台操作，不需要打开app
	action1.authenticationRequired = YES; // 是否需要解锁
	action1.destructive = YES; // 样式区别
	
	UIMutableUserNotificationAction * action2 = [[UIMutableUserNotificationAction alloc] init];
	action2.identifier = @"action2";
	action2.title=@"回复";
	action2.behavior = UIUserNotificationActionBehaviorTextInput; // 操作类型，输入框
	action2.activationMode = UIUserNotificationActivationModeBackground; // 后台操作，不需要打开app
	
	
	UIMutableUserNotificationAction * action3 = [[UIMutableUserNotificationAction alloc] init];
	action3.identifier = @"action3";
	action3.title=@"查看";
	action3.behavior = UIUserNotificationActionBehaviorDefault; // 操作类型，默认按钮
	action3.activationMode = UIUserNotificationActivationModeForeground; // 前台操作，打开app
	//如果 activationMode = UIUserNotificationActivationModeForeground，authenticationRequired设置之后不起作用；如果需要前台操作就需要打开app，那肯定是需要解锁的
	action1.authenticationRequired = NO;
	
	
	UIMutableUserNotificationCategory * category1 = [[UIMutableUserNotificationCategory alloc] init];
	category1.identifier = @"Category1";
	[category1 setActions:@[action1,action2,action3] forContext:(UIUserNotificationActionContextDefault)];
	
	UIMutableUserNotificationCategory * category2 = [[UIMutableUserNotificationCategory alloc] init];
	category2.identifier = @"Category2";
	[category2 setActions:@[action2] forContext:(UIUserNotificationActionContextDefault)];
	
	UIUserNotificationSettings *uns = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound) categories:[NSSet setWithObjects: category1,category2, nil]];
	
	[[UIApplication sharedApplication] registerUserNotificationSettings: uns];
	
}
#pragma mark ---delegate
	// 获取推送的token
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
	NSLog(@"%@",deviceToken);
}
	
	//在非本App界面时收到消息，下拉消息会有快捷回复的按钮，点击按钮后调用的方法，根据identifier来判断点击的哪个按钮，responseInfo为消息内容
-(void)application:(UIApplication *)application handleActionWithIdentifier:(NSString *)identifier forRemoteNotification:(nonnull NSDictionary *)userInfo withResponseInfo:(nonnull NSDictionary *)responseInfo completionHandler:(nonnull void (^)())completionHandler {
	
	NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
	NSURLSessionTask *task = [session dataTaskWithURL:[NSURL URLWithString:@"http://10.1.60.4:8080/msg/send/now"] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
		NSLog(@"%@--%@",response,error);
	}];
	[task resume];
	
	completionHandler();
}
	// 静默推送处理 "content-available" : 1
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
	NSLog(@"%@",userInfo);
	NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
	NSURLSessionTask *task = [session dataTaskWithURL:[NSURL URLWithString:@"http://10.1.60.4:8080/msg/verify"] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
		NSLog(@"%@--%@",response,error);
	}];
	[task resume];
	completionHandler(UIBackgroundFetchResultNewData);
}
	
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
	NSLog(@"%@",userInfo);
}

@end
