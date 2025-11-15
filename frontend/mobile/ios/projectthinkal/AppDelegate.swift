import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {

  override func application(_ application: UIApplication,
                            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {

    // ✅ Firebase Initialization
    FirebaseApp.configure()

    // ✅ Push Notification Setup
    UNUserNotificationCenter.current().delegate = self

    let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
    UNUserNotificationCenter.current().requestAuthorization(options: authOptions) { granted, error in
      if let error = error {
        print("🔴 Notification permission error: \(error.localizedDescription)")
      }
    }

    application.registerForRemoteNotifications()

    // ✅ Reset badge on app launch
    UIApplication.shared.applicationIconBadgeNumber = 0

    self.moduleName = "projectthinkal"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // 🔁 Forward APNs device token to Firebase
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // 📩 Handle foreground notifications
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {

    // ✅ Optional: Reset badge on receiving notification in foreground
    UIApplication.shared.applicationIconBadgeNumber = 0

    completionHandler([.banner, .sound, .badge])
  }

  // 📥 Handle notification tap
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {

    // ✅ Reset badge on tap
    UIApplication.shared.applicationIconBadgeNumber = 0

    completionHandler()
  }

  // 🔄 Lock orientation to portrait
  override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return .portrait
  }

  // 🔗 JS Bundle URL
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}