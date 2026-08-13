import { getRepository } from "@/lib/repo";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Enquiry, Product } from "@/types";
import { isDbConnectionError, DB_SETUP_HINT } from "@/lib/db/db-error";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  let productsCount = 0;
  let categoriesCount = 0;
  let totalEnquiries = 0;
  let pendingEnquiries = 0;
  let contactedEnquiries = 0;
  let resolvedEnquiries = 0;
  let recentEnquiries = 0;
  let dbUnavailable = false;
  let products: Product[] = [];
  let enquiries: Enquiry[] = [];

  try {
    const repo = getRepository();
    products = await repo.getAllProducts({}, undefined);
    productsCount = products.length;
    const categories = await repo.getAllCategories();
    categoriesCount = categories.length;
    enquiries = await repo.getAllEnquiries();
    totalEnquiries = enquiries.length;

    pendingEnquiries = enquiries.filter((e) => e.status === "pending").length;
    contactedEnquiries = enquiries.filter((e) => e.status === "contacted").length;
    resolvedEnquiries = enquiries.filter((e) => e.status === "resolved").length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    recentEnquiries = enquiries.filter(
      (e) => new Date(e.createdAt) > sevenDaysAgo,
    ).length;
  } catch (error) {
    if (isDbConnectionError(error)) {
      dbUnavailable = true;
      console.warn(DB_SETUP_HINT);
    } else {
      throw error;
    }
  }

  const stats = [
    {
      title: "Total Products",
      value: productsCount,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      href: "/admin/products",
    },
    {
      title: "Categories",
      value: categoriesCount,
      icon: FolderTree,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      href: "/admin/categories",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiries,
      icon: Mail,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      href: "/admin/enquiries",
    },
    {
      title: "New This Week",
      value: recentEnquiries,
      icon: TrendingUp,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      href: "/admin/enquiries",
    },
  ];

  const enquiryStats = [
    {
      title: "Pending",
      value: pendingEnquiries,
      icon: AlertCircle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      description: "Need attention",
    },
    {
      title: "Contacted",
      value: contactedEnquiries,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "In progress",
    },
    {
      title: "Resolved",
      value: resolvedEnquiries,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: "Completed",
    },
  ];

  return (
    <div className="cms-studio">
      <PageHeader
        title="Dashboard"
        description="Welcome to your CMS dashboard"
      />
      <div className="cms-studio-body">
      <div className="space-y-4">
        {dbUnavailable && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <strong>Database offline.</strong> Start Docker Desktop, then run{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">npm run db:setup</code>{" "}
            to connect PostgreSQL. The site is using default settings until then.
          </div>
        )}
        {/* Main Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={cn("rounded-full p-2", stat.bgColor)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Enquiry Status Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Enquiry Status Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {enquiryStats.map((stat) => (
              <Card
                key={stat.title}
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                    <div className={cn("rounded-full p-3", stat.bgColor)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Enquiries */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="dark:text-white">
                Recent Enquiries
              </CardTitle>
              <Link
                href="/admin/enquiries"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enquiries.length > 0 ? (
                  enquiries.slice(0, 5).map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {enquiry.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {enquiry.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {enquiry.type || "general"}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
                            enquiry.status === "pending" &&
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
                            enquiry.status === "contacted" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
                            enquiry.status === "resolved" &&
                              "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
                          )}
                        >
                          {enquiry.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No enquiries yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="dark:text-white">Recent Products</CardTitle>
              <Link
                href="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productsCount > 0 ? (
                  products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          CAS: {product.casNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
                            product.inStock
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                          )}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No products yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {pendingEnquiries > 0 && (
          <div className="mt-8">
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      You have {pendingEnquiries} pending enquir
                      {pendingEnquiries === 1 ? "y" : "ies"}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      Customer enquiries are waiting for your response.
                    </p>
                  </div>
                  <Link href="/admin/enquiries">
                    <button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Review Now
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
