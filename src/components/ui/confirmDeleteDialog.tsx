"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
}) => {
    const t = useTranslations("common");

    const dialogTitle = title
    const dialogDescription = description;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <p className="py-2">{dialogDescription}</p>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        {t("cancel")}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {t("confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
