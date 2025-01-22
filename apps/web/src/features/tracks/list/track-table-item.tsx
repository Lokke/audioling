import { useEffect, useRef } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import { createRoot } from 'react-dom/client';
import type { TrackItem } from '@/api/api-types.ts';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableItemProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import styles from '@/features/ui/item-list/item-table/table-row.module.scss';
import type { ItemListQueryData } from '@/hooks/use-list.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

const InnerTableServerItem = (props: ItemTableItemProps<string>) => {
    const {
        context,
        data: uniqueId,
        enableExpanded,
        index,
        itemType,
        onRowClick,
        onRowDoubleClick,
        onRowContextMenu,
        onRowDrop,
        onRowDrag,
        onRowDragData,
        enableRowDrag,
        rowId,
        table,
        tableId,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const row = table.getRow(rowId);

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();
    const isExpanded = row?.getIsExpanded();

    const { data: list } = useQuery<ItemListQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getQueryKey(
            context.libraryId,
            context.listKey,
            LibraryItemType.TRACK,
        ),
    });

    useEffect(() => {
        if (!ref.current) return;

        const fns = [];

        if (enableRowDrag) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        const isSelfSelected = row.getIsSelected();

                        if (isSelfSelected) {
                            const selectedRows = table.getSelectedRowModel().rows;

                            const selectedRowIds = [];
                            const selectedItemUniqueIds = [];
                            const items: TrackItem[] = [];

                            for (const row of selectedRows) {
                                selectedRowIds.push(row.id);
                                selectedItemUniqueIds.push(row.original);
                            }

                            for (const uniqueId of selectedItemUniqueIds) {
                                const id = list?.uniqueIdToId[uniqueId as string] as string;
                                const item = list?.data[id] as TrackItem | undefined;
                                if (item) {
                                    items.push(item);
                                }
                            }

                            return dndUtils.generateDragData({
                                id: selectedRowIds,
                                item: items,
                                operation: [DragOperation.ADD],
                                type: DragTarget.TRACK,
                            });
                        }

                        const id = list?.uniqueIdToId[uniqueId as string] as string;
                        const singleItem = list?.data[id] as TrackItem | undefined;

                        return dndUtils.generateDragData({
                            id: [row.id],
                            item: singleItem ? [singleItem] : [],
                            operation: [DragOperation.ADD],
                            type: DragTarget.TRACK,
                        });
                    },
                    onDragStart: () => {
                        const isSelfSelected = row.getIsSelected();

                        // If attempting to drag a row that is not selected, select it
                        if (!isSelfSelected) {
                            table.resetRowSelection();
                            row.toggleSelected(true);
                        }
                    },
                    onDrop: () => {},
                    onGenerateDragPreview: (data) => {
                        disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                        setCustomNativeDragPreview({
                            nativeSetDragImage: data.nativeSetDragImage,
                            render: ({ container }) => {
                                const root = createRoot(container);
                                const selectedCount = table.getSelectedRowModel().rows.length || 1;
                                root.render(<DragPreview itemCount={selectedCount} />);
                            },
                        });
                    },
                }),
            );
        }

        return combine(...fns);
    }, [
        enableRowDrag,
        index,
        itemType,
        list?.data,
        list?.uniqueIdToId,
        onRowDrag,
        onRowDragData,
        onRowDrop,
        row,
        row.id,
        table,
        uniqueId,
    ]);

    const data = list?.data[list.uniqueIdToId[uniqueId as string]];

    if (enableExpanded && !isExpanded) {
        return null;
    }

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: canSelect,
                    [styles.selected]: isSelected,
                })}
                style={context.columnStyles?.styles}
                onClick={(e) => onRowClick?.(e, row, table)}
                onContextMenu={(e) => onRowContextMenu?.(e, row, table)}
                onDoubleClick={(e) => onRowDoubleClick?.(e, row, table)}
            >
                {row?.getVisibleCells()?.map((cell) => {
                    return (
                        <Fragment key={`${tableId}-cell-${cell.id}`}>
                            {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                                context: {
                                    ...context,
                                    data,
                                },
                            })}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export function TrackTableServerItem(props: ItemTableItemProps<string>) {
    return <InnerTableServerItem {...props} />;
}

const InnerTrackTableItem = (props: ItemTableItemProps<TrackItem>) => {
    const {
        context,
        data: uniqueId,
        enableExpanded,
        index,
        itemType,
        onRowClick,
        onRowDoubleClick,
        onRowContextMenu,
        onRowDrop,
        onRowDrag,
        onRowDragData,
        enableRowDrag,
        rowId,
        table,
        tableId,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const row = table.getRow(rowId);

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();
    const isExpanded = row?.getIsExpanded();

    useEffect(() => {
        if (!ref.current) return;

        const fns = [];

        if (enableRowDrag) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        const isSelfSelected = row.getIsSelected();

                        if (isSelfSelected) {
                            const selectedRows = table.getSelectedRowModel().rows;

                            const selectedRowIds = [];
                            const selectedItems = [];

                            for (const row of selectedRows) {
                                selectedRowIds.push(row.id);
                                selectedItems.push(row.original);
                            }

                            return dndUtils.generateDragData({
                                id: selectedRowIds,
                                item: selectedItems,
                                operation: [DragOperation.ADD],
                                type: DragTarget.TRACK,
                            });
                        }

                        return dndUtils.generateDragData({
                            id: [row.id],
                            item: [row.original],
                            operation: [DragOperation.ADD],
                            type: DragTarget.TRACK,
                        });
                    },
                    onDragStart: () => {
                        const isSelfSelected = row.getIsSelected();

                        // If attempting to drag a row that is not selected, select it
                        if (!isSelfSelected) {
                            table.resetRowSelection();
                            row.toggleSelected(true);
                        }
                    },
                    onDrop: () => {},
                    onGenerateDragPreview: (data) => {
                        disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                        setCustomNativeDragPreview({
                            nativeSetDragImage: data.nativeSetDragImage,
                            render: ({ container }) => {
                                const root = createRoot(container);
                                const selectedCount = table.getSelectedRowModel().rows.length || 1;
                                root.render(<DragPreview itemCount={selectedCount} />);
                            },
                        });
                    },
                }),
            );
        }

        return combine(...fns);
    }, [
        enableRowDrag,
        index,
        itemType,
        onRowDrag,
        onRowDragData,
        onRowDrop,
        row,
        row.id,
        table,
        uniqueId,
    ]);

    if (enableExpanded && !isExpanded) {
        return null;
    }

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: canSelect,
                    [styles.selected]: isSelected,
                })}
                style={context.columnStyles?.styles}
                onClick={(e) => onRowClick?.(e, row, table)}
                onContextMenu={(e) => onRowContextMenu?.(e, row, table)}
                onDoubleClick={(e) => onRowDoubleClick?.(e, row, table)}
            >
                {row?.getVisibleCells()?.map((cell) => {
                    return (
                        <Fragment key={`${tableId}-cell-${cell.id}`}>
                            {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                                context: {
                                    currentTrack: context.currentTrack,
                                    libraryId: context.libraryId!,
                                    listKey: context.listKey,
                                },
                            })}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};
export function TrackTableItem(props: ItemTableItemProps<TrackItem>) {
    return <InnerTrackTableItem {...props} />;
}
