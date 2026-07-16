"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DocumentCardProps {
  title: string;
  icon?: React.ElementType;
  src?: string | null;
  isLoading?: boolean;
  className?: string;
}

export const DocumentCard = ({
  title,
  icon: Icon = FileText,
  src,
  isLoading,
  className,
}: DocumentCardProps) => {
  const [hidden, setHidden] = useState(false);
  const { t} = useTranslation("user-management");

  const handleDownload = () => {
    if (!src) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = `${title.replace(/\s+/g, "_")}.jpg`;
    link.click();
  };

  return (
    <Card className={cn("w-full max-w-md overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Document Preview Area */}
        <div className="relative aspect-[4/3] bg-muted">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">
                  {t("userManagement.inspect.about.documentView.loadingDocument")} 
                </p>
              </div>
            </div>
          ) : hidden ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <EyeOff className="h-12 w-12" />
                <p className="text-sm font-medium">{t("userManagement.inspect.about.documentView.documentHidden")}</p>
              </div>
            </div>
          ) : (
            <Image
              src={
                src ||
                "/placeholder.svg?height=600&width=800&query=document preview" ||
                "/placeholder.svg"
              }
              alt={`${title} Document`}
              fill
              unoptimized
              className="object-contain p-4"
            />
          )}
        </div>

        {/* Document Info & Actions */}
        <div className="p-4 space-y-3 border-t">
          {/* Title with Icon */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight text-balance">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                 {isLoading
                  ? t("userManagement.inspect.about.documentView.loadingDocument")  
                  : src
                  ? t("userManagement.inspect.about.documentView.readyToView") 
                  : t("userManagement.inspect.about.documentView.noDocument")}  
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHidden(!hidden)}
              className="flex-1"
            >
              {hidden ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  {t("show")}
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  {t("hide")}
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={!src}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("download")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
