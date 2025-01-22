import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { PlaylistGridItem } from '@/features/playlists/list/playlist-grid-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfinitePlaylistGridProps extends InfiniteItemListProps<GetApiLibraryIdPlaylistsParams> {}

export function InfinitePlaylistGrid(props: InfinitePlaylistGridProps) {
    const { listKey } = props;

    return (
        <ListWrapper listKey={listKey}>
            <InfinitePlaylistGridContent {...props} />
        </ListWrapper>
    );
}

export function InfinitePlaylistGridContent({
    itemCount,
    libraryId,
    listKey,
    pagination,
    params,
}: InfinitePlaylistGridProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.PLAYLIST,
    });

    return (
        <InfiniteItemGrid<string>
            ItemComponent={PlaylistGridItem}
            context={{ libraryId, listKey }}
            data={data}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
