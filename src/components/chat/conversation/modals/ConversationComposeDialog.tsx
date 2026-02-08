import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponseUserDto } from "@/types";
import { Search, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationComposeDialogProps {
  users: ResponseUserDto[];
  participants: string[];
  setParticipants: (value: string[]) => void;
  composeAction?: () => void;
  currentUserId?: string;

}

export const useConversationComposeDialog = ({
  users,
  participants,
  setParticipants,
  composeAction,
  currentUserId,

}: ConversationComposeDialogProps) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("user-management");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];

    const filtered = users.filter((user) => {
      if (user.id === currentUserId) return false;

      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.username?.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        username.includes(searchLower)
      );
    });

    return filtered;
  }, [users, searchTerm, currentUserId]);


  const toggleUser = (userId: string) => {
    setParticipants(
      participants.includes(userId)
        ? participants.filter((id) => id !== userId)
        : [...participants, userId]
    );
  };
  const clearSelections = () => {
    setParticipants([]);
  };

  const selectedCount = participants.filter(id => id !== currentUserId).length;



  const {
    DialogFragment: composeConversationDialog,
    openDialog: openComposeConversationDialog,
    closeDialog: closeComposeConversationDialog,
  } = useDialog({
    title: <div className="leading-normal">{t("userManagement.inspect.conversations.composeDialog.title")}</div>,
    description: t("userManagement.inspect.conversations.composeDialog.description"),
    children: (
      <div className="flex flex-col gap-4">
        <div className="relative">

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
           placeholder={t("userManagement.inspect.conversations.composeDialog.searchPlaceholder")} 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="pl-9 pr-9 "
           />

           {searchTerm && (
            <Button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2  "
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
           )}
        </div>     
      
             {selectedCount > 0 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">
              {selectedCount} {selectedCount !== 1 
                ? t("userManagement.inspect.conversations.composeDialog.usersSelected")
                : t("userManagement.inspect.conversations.composeDialog.userSelected")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelections}
              className="h-8 text-xs"
            >
              {t("userManagement.inspect.conversations.composeDialog.clearAll")}
            </Button>
          </div>
        )}
         <ScrollArea className="h-[400px] rounded-md border overflow-y-auto">
          <div className="p-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("userManagement.inspect.conversations.composeDialog.noUsersFound")
                  : t("userManagement.inspect.conversations.composeDialog.noUsersAvailable")}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((user) => {
                  const isSelected = participants.includes(user.id);
                  const avatar = identifyUserAvatar(user);
                  const displayName = identifyUser(user);

                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        "hover:bg-accent",
                        isSelected && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleUser(user.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                           src={user.profile?.picture?.filename ? `/uploads/${user.profile.picture.filename}` : undefined}
    alt={displayName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user.username}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary">
                          <span className="text-xs font-medium">{t("userManagement.inspect.conversations.composeDialog.selected")}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            variant="outline"
            onClick={() => {
              closeComposeConversationDialog();
              setSearchTerm("");
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
          <Button
            onClick={() => {
              composeAction?.();
              setSearchTerm("");
            }}
            disabled={selectedCount === 0}
          >
            {tCommon("common.buttons.compose")}
            {selectedCount > 0 && ` (${selectedCount})`}
          </Button>
        </div>
           
         </div>
    ),
    className: "w-[600px] max-w-[90vw]",
  onToggle: () => {
      setSearchTerm("");
    },  });

  return {
    composeConversationDialog,
    openComposeConversationDialog,
    closeComposeConversationDialog,
  };
};
