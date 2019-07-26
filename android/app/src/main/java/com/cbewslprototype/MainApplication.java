package com.cbewslprototype;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNReactNativePingPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.reactlibrary.RNReactNativePingPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.sha512lib.Sha512Package;
import com.rhaker.reactnativesmsandroid.RNSmsAndroidPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNReactNativePingPackage(),
            SendSMSPackage.getInstance(),
            new SmsListenerPackage(),
            new Sha512Package(),
            new RNSmsAndroidPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
