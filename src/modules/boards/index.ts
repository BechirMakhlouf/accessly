// Boards module public exports (kept intentionally minimal for now)

// Service / factory
export { BoardsService } from './boards.service';
export { createBoardService } from './board-factory';

// Actions
export {
  getBoardBySlug,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  updateBoardMemberRole,
  hardDeleteBoard
} from './actions';

// Types
export type {
  Board,
  BoardInput,
  BoardUpdate,
  BoardRole
} from './types';

// Hooks
export { useBoardBySlug } from './hooks/use-board-by-slug';
export { useBoard } from './hooks/use-board';
export { useBoardMutations } from './hooks/use-board-mutations';

// Components
export { NewBoardForm } from './components/new-board-form';
