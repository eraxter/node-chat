using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace ChatApp
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/jquery").Include(
                "~/Scripts/jquery-3.3.1.min.js"));

            bundles.Add(new ScriptBundle("~/scripts/angular").Include(
                "~/Scripts/angular.min.js",
                "~/Scripts/angular-route.min.js"));

            bundles.Add(new ScriptBundle("~/scripts/src").Include(
                "~/Scripts/src/socket.js",
                "~/Scripts/src/app.js",
                "~/Scripts/src/main.js",
                "~/Scripts/src/chat.js"));

            bundles.Add(new StyleBundle("~/styles/site").Include(
                "~/Content/site.css"));
        }
    }
}