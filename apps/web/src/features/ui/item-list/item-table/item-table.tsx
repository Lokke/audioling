import type { ElementType, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LibraryItemType } from '@repo/shared-types';
import type { DisplayColumnDef, Row, Table } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { Virtuoso } from 'react-virtuoso';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import { TableRow } from '@/features/ui/item-list/item-table/table-row.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './item-table.module.scss';

export interface TableItemProps<T, C extends { baseUrl: string; libraryId: string }> {
    context?: C;
    data: T | undefined;
    index: number;
}

export type ItemTableRowDrop = {
    data: DragData;
    edge: Edge | null;
    id: string;
    index: number;
    uniqueId: string;
};

export interface ItemTableProps<T, C extends { baseUrl: string; libraryId: string }> {
    HeaderComponent?: ElementType;
    columnOrder: ItemListColumn[];
    columns: DisplayColumnDef<T | undefined>[];
    context: C;
    data: Map<number, T>;
    enableHeader?: boolean;
    enableMultiRowSelection?: boolean;
    enableRowSelection?: boolean;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    itemType: LibraryItemType;
    onChangeColumnOrder: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onRowClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowContextMenu?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDoubleClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDrop?: (args: ItemTableRowDrop) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
}

export function ItemTable<
    T extends { _uniqueId: string; id: string },
    C extends { baseUrl: string; libraryId: string },
>(props: ItemTableProps<T, C>) {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        enableMultiRowSelection,
        enableRowSelection,
        HeaderComponent,
        initialScrollIndex,
        enableHeader = true,
        isScrolling,
        itemCount,
        itemType,
        onEndReached,
        onRangeChanged,
        onRowClick,
        onRowContextMenu,
        onRowDoubleClick,
        onRowDrop,
        onScroll,
        onStartReached,
    } = props;

    const tableId = useId();

    const rowsRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);
    const [initialize, osInstance] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'hidden', y: 'scroll' },
            paddingAbsolute: true,
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'al-os-scrollbar',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        const { current: root } = rowsRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller as HTMLElement },
                target: root,
            });

            autoScrollForElements({
                element: scroller as HTMLElement,
                getAllowedAxis: () => 'vertical',
                getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    const tableData = useMemo(() => {
        return Array.from({ length: itemCount }, (_, index) => data.get(index));
    }, [data, itemCount]);

    const table = useReactTable({
        columns,
        data: tableData,
        enableMultiRowSelection,
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnOrder,
        },
    });

    const headers = table.getFlatHeaders();

    const columnStyles = useMemo(() => {
        const headerSizes = headers.map((header) => header.getSize());

        const sizes: string[] = [];
        const columns = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        const styles = {
            gridTemplateColumns: columns.join(' '),
        };

        return { sizes, styles };
    }, [headers]);

    const tableContext = useMemo(() => ({ ...context, columnStyles }), [context, columnStyles]);

    // const handleRowContextMenu = useCallback(
    //     (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>) => {
    //         e.stopPropagation();

    //         e.currentTarget.dispatchEvent(
    //             new MouseEvent('contextmenu', {
    //                 bubbles: true,
    //                 clientX: e.currentTarget.getBoundingClientRect().x,
    //                 clientY: e.currentTarget.getBoundingClientRect().y,
    //             }),
    //         );

    //         table.resetRowSelection();
    //         row.toggleSelected();
    //     },
    //     [table],
    // );

    return (
        <div
            className={clsx(styles.container, {
                [styles.noHeader]: !enableHeader,
            })}
        >
            {enableHeader && (
                <div className={styles.header} style={columnStyles.styles}>
                    {headers.map((header) => (
                        <TableHeader
                            key={`header-${header.id}`}
                            columnOrder={columnOrder}
                            columnStyles={columnStyles.styles}
                            header={header}
                            setColumnOrder={onChangeColumnOrder}
                            tableId={tableId}
                        />
                    ))}
                </div>
            )}
            <div ref={rowsRef} className={styles.rows} data-overlayscrollbars-initialize="">
                <Virtuoso
                    components={{
                        Header: HeaderComponent
                            ? (props) => <HeaderComponent {...props} />
                            : undefined,
                    }}
                    context={tableContext}
                    endReached={onEndReached}
                    increaseViewportBy={100}
                    initialTopMostItemIndex={initialScrollIndex || 0}
                    isScrolling={isScrolling}
                    itemContent={(index, _data, context) => (
                        <TableRow
                            context={context}
                            index={index}
                            itemType={itemType}
                            table={table}
                            tableId={tableId}
                            onRowClick={onRowClick}
                            onRowContextMenu={onRowContextMenu}
                            onRowDoubleClick={onRowDoubleClick}
                            onRowDrop={onRowDrop}
                        />
                    )}
                    rangeChanged={onRangeChanged}
                    scrollerRef={setScroller}
                    startReached={onStartReached}
                    style={{ overflow: 'hidden' }}
                    totalCount={itemCount}
                    onScroll={onScroll}
                />
            </div>
        </div>
    );
}
