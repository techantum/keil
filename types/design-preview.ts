export type DesignPreviewStatus = "draft" | "live";

export type DesignPreviewPage = {
  id: string;
  label: string;
  slug: string;
  image: string;
};

export type DesignPreview = {
  id: string;
  title: string;
  clientName: string;
  shareToken: string;
  status: DesignPreviewStatus;
  /** Shown in the optional browser address bar, e.g. www.client.com */
  siteUrl: string;
  showBrowserChrome: boolean;
  pages: DesignPreviewPage[];
  createdAt: string;
  updatedAt: string;
};

export type CreateDesignPreviewInput = {
  title: string;
  clientName?: string;
  siteUrl?: string;
  showBrowserChrome?: boolean;
  pages?: DesignPreviewPage[];
  status?: DesignPreviewStatus;
};

export type UpdateDesignPreviewInput = Partial<{
  title: string;
  clientName: string;
  siteUrl: string;
  showBrowserChrome: boolean;
  pages: DesignPreviewPage[];
  status: DesignPreviewStatus;
  shareToken: string;
}>;
