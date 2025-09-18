import { Database } from "@/types/database.types";
import { Profile } from "@/modules/profiles/types";

export type Board = Database["public"]["Tables"]["boards"]["Row"];
export type BoardInsert = Database["public"]["Tables"]["boards"]["Insert"];
export type BoardUpdate = Database["public"]["Tables"]["boards"]["Update"];
export type BoardMember = Database["public"]["Tables"]["board_members"]["Row"];

// Enums
export type BoardRole = Database["public"]["Enums"]["boards_role"];
export type BoardVisibility = Database["public"]["Enums"]["boards_visibility"];

// Convenience role type
export type BoardAdminRole = Extract<BoardRole, "admin">;

// Input used by service/UI when creating a board (created_by may be injected from session)
export type BoardInput = BoardInsert;

export interface BoardWithMembers extends Board {
  members: Database["public"]["Tables"]["board_members"]["Row"][];
}

export interface BoardMemberWithProfile extends BoardMember {
  profile?: Profile;
}
