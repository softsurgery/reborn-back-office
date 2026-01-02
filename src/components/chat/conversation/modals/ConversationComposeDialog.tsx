import { useDialog } from "@/components/shared/Dialogs";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import {
  Field,
  FieldVariant,
  FormStructure,
  MultiSelectFieldProps,
  SelectOption,
} from "@/components/shared/form-builder/types";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslation } from "react-i18next";

interface ConversationComposeDialogProps {
  users: SelectOption[];
  participants: SelectOption[];
  setParticipants: (value: SelectOption[]) => void;
  composeAction?: () => void;
}

export const useConversationComposeDialog = ({
  users,
  participants,
  setParticipants,
  composeAction,
}: ConversationComposeDialogProps) => {
  const { t: tCommon } = useTranslation("common");

  const formStructure: FormStructure = {
    title: "Compose conversation",
    fieldsets: [
      {
        title: "Participants",
        rows: [
          {
            fields: [
              {
                id: "participants",
                variant: FieldVariant.MULTI_SELECT,
                props: {
                  value: participants,
                  options: users,
                  onChange: (value: SelectOption[]) => {
                    setParticipants(value);
                  },
                },
              } satisfies Field<MultiSelectFieldProps>,
            ],
          },
        ],
      },
    ],
  };
  const {
    DialogFragment: composeConversationDialog,
    openDialog: openComposeConversationDialog,
    closeDialog: closeComposeConversationDialog,
  } = useDialog({
    title: <div className="leading-normal">New Conversation Compose</div>,
    description: "You can create a new conversation",
    children: (
      <div>
        <FormBuilder structure={formStructure} />
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              composeAction?.();
            }}
          >
            {tCommon("common.buttons.compose")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              closeComposeConversationDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: () => {},
  });

  return {
    composeConversationDialog,
    openComposeConversationDialog,
    closeComposeConversationDialog,
  };
};
