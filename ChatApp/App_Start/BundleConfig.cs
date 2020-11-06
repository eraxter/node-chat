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
            bundles.Add(new ScriptBundle("~/scripts/bootstrap").Include(
                "~/Scripts/jquery-3.5.1.min.js",
                "~/Scripts/umd/popper.min.js",
                "~/Scripts/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/scripts/angular").Include(
                "~/Scripts/angular.min.js",
                "~/Scripts/angular-route.min.js"));

            bundles.Add(new ScriptBundle("~/scripts/app").Include(
                "~/Scripts/chat/socket.js",
                "~/Scripts/chat/app.js",
                "~/Scripts/chat/main.js",
                "~/Scripts/chat/chat.js"));

            bundles.Add(new StyleBundle("~/styles/main").Include(
                "~/Content/css/bootstrap.min.css",
                "~/Content/css/main.css"));
        }
    }
}
