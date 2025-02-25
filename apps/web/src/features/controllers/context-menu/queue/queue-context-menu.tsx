import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { QueueCache } from '@/features/controllers/context-menu/queue/queue-cache.tsx';
import { QueueDownload } from '@/features/controllers/context-menu/queue/queue-download.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { QueueMove } from '@/features/controllers/context-menu/queue/queue-move.tsx';
import { QueueRemove } from '@/features/controllers/context-menu/queue/queue-remove.tsx';
import { QueueShare } from '@/features/controllers/context-menu/queue/queue-share.tsx';
import { QueueShuffle } from '@/features/controllers/context-menu/queue/queue-shuffle.tsx';
import { AddToPlaylistContextItem } from '@/features/controllers/context-menu/shared/add-to-playlist-context-item.tsx';
import { FavoritesContextItem } from '@/features/controllers/context-menu/shared/favorites-context-item.tsx';
import { RatingContextItem } from '@/features/controllers/context-menu/shared/rating-context-item.tsx';
import { useFavoriteTrack } from '@/features/favorites/hooks/use-favorite-track.ts';
import { useUnfavoriteTrack } from '@/features/favorites/hooks/use-unfavorite-track.ts';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface QueueContextMenuProps {
    items: PlayQueueItem[];
}

export function QueueContextMenu({ items }: QueueContextMenuProps) {
    const { libraryId } = useParams() as { libraryId: string };

    const { ids, tracks } = useMemo(() => {
        const tracks = items.filter((item): item is PlayQueueItem => item !== undefined);
        const ids = tracks.map((track) => track.id);
        return { ids, tracks };
    }, [items]);

    const { mutate: favoriteTrack } = useFavoriteTrack();
    const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    const handleFavorite = useCallback(() => {
        favoriteTrack({ data: { ids }, libraryId });
    }, [favoriteTrack, ids, libraryId]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteTrack({ data: { ids }, libraryId });
    }, [unfavoriteTrack, ids, libraryId]);

    return (
        <ContextMenu.Content>
            <QueueRemove items={items} />
            <ContextMenu.Divider />
            <AddToPlaylistContextItem tracks={tracks} />
            <RatingContextItem />
            <FavoritesContextItem onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <ContextMenu.Divider />
            <QueueShuffle items={items} />
            <QueueMove items={items} />
            <ContextMenu.Divider />
            <QueueDownload />
            <QueueCache />
            <ContextMenu.Divider />
            <QueueShare />
            <ContextMenu.Divider />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
