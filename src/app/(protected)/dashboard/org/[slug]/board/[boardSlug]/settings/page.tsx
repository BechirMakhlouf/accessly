"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Trash2, AlertTriangle } from "lucide-react";

import { useActiveBoard } from "@/modules/boards/hooks/useActiveBoard";
import { useActiveOrgBoards } from "@/modules/boards/hooks/useOrgBoards";
import { BoardDetailsFormData, createBoardDetailsSchema } from "@/modules/boards/schemas";
import { useTranslations } from "next-intl";
import { useActiveOrg } from "@/modules/organizations";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { routes } from "@/lib/routes";

export default function BoardSettingsPage() {
  const { activeBoard: board, isLoading } = useActiveBoard();
  const { activeOrganization } = useActiveOrg();
  const { updateBoard, isUpdating, deleteBoard, isDeleting } = useActiveOrgBoards();
  const [confirmInput, setConfirmInput] = useState("");
  const router = useRouter();
  const t = useTranslations(); 

  
  const form = useForm<BoardDetailsFormData>({
    resolver: zodResolver(createBoardDetailsSchema(t)),
    defaultValues: {
      name: board?.title ?? "",
      description: board?.description ?? "",
    },
    mode: "onChange",
  });

  
  useEffect(() => {
    if (board) {
      form.reset({
        name: board.title ?? "",
        description: board.description ?? "",
      });
    }
  }, [board, form]);

  
  const onSubmit = async (data: BoardDetailsFormData) => {
    if (!board) return;

    if (data.name === board.title && data.description === board.description) {
      toast.info(t("boards.settings.general.saving")); 
      return;
    }

    try {
      await updateBoard(board.id, {
        title: data.name,
        description: data.description,
      });
      toast.success(t("boards.actions.updated"));
    } catch (e) {
      console.error("Failed to update board:", e);
      toast.error(t("boards.actions.updateError"));
    }
  };


  const handleDeleteBoard = async () => {
    if (!board) return;

    const orgSlug = activeOrganization?.slug;
    if (!orgSlug) {
      toast.error("Cannot determine organization slug for redirect");
      return;
    }

    try {
      await deleteBoard(board.id);
      toast.success(t("boards.actions.deleted", { boardTitle: board.title } as Record<string, string>));

      
      router.push(routes.protected.dashboard.org.slug.boards.root(orgSlug));
    } catch (e) {
      console.error("Failed to delete board:", e);
      toast.error(t("boards.actions.updateError"));
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!board) return <p>No board found.</p>;

  const hasChanges =
    form.watch("name") !== board.title ||
    form.watch("description") !== board.description;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("boards.settings.general.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("boards.description")}</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t("boards.settings.general.title")}
            </CardTitle>
            <CardDescription>{t("boards.settings.general.boardDescription.label")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="board-name">{t("boards.settings.general.board.label")}</Label>
                <Input id="board-name" placeholder={t("boards.form.name.placeholder")} {...form.register("name")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="board-description">{t("boards.settings.general.boardDescription.label")}</Label>
                <Textarea id="board-description" placeholder={t("boards.form.description.placeholder")} {...form.register("description")} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating || !form.formState.isValid || !hasChanges}>
                  {isUpdating ? (
                    <>
                      <Save className="mr-2 h-4 w-4" /> {t("boards.settings.general.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> {t("boards.settings.general.saveChanges")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h4 className="font-medium text-destructive mb-2">Delete Board</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete a board, there is no going back. Please be certain.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete Board"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{`Delete board "${board.title}"?`}</AlertDialogTitle>

                      <AlertDialogDescription>
                        This action cannot be undone. To confirm, please type <strong>{board.title}</strong> below:
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="mt-4">
                      <Label htmlFor="confirm-name">Board Name</Label>
                      <Input id="confirm-name" placeholder={`Type "${board.title}"`} onChange={(e) => setConfirmInput(e.target.value)} />
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteBoard}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        disabled={confirmInput !== board.title}
                      >
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
