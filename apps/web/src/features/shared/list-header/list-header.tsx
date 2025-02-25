import { type ReactNode, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './list-header.module.scss';

interface ListHeaderProps {
    children: ReactNode;
}

export function ListHeader(props: ListHeaderProps) {
    const { children } = props;

    return <div className={styles.container}>{children}</div>;
}

interface ListHeaderLeftProps {
    children: ReactNode;
}

function Left(props: ListHeaderLeftProps) {
    const { children } = props;

    return <div className={styles.left}>{children}</div>;
}

interface ListHeaderRightProps {
    children: ReactNode;
}

function Right(props: ListHeaderRightProps) {
    const { children } = props;

    return <div className={styles.right}>{children}</div>;
}

interface ListHeaderTitleProps {
    children: ReactNode;
}

function Title(props: ListHeaderTitleProps) {
    const { children } = props;

    return <div className={styles.title}>{children}</div>;
}

interface ListHeaderItemCountProps {
    value: number;
}

function ItemCount(props: ListHeaderItemCountProps) {
    const { value } = props;
    const spring = useSpring(value, { damping: 15, mass: 0.8, stiffness: 75 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    const [previousValue, setPreviousValue] = useState(value);

    useEffect(() => {
        if (previousValue !== value && value !== undefined) {
            spring.set(value);
            setPreviousValue(value);
        }
    }, [previousValue, spring, value]);

    return <motion.span className={styles.itemCount}>{display}</motion.span>;
}

interface ListHeaderFooterProps {
    children: ReactNode;
}

function Footer(props: ListHeaderFooterProps) {
    const { children } = props;

    return <div className={styles.footer}>{children}</div>;
}

interface ListHeaderQueryBuilderProps {
    children: ReactNode;
    isOpen: boolean;
}

function QueryBuilder(props: ListHeaderQueryBuilderProps) {
    const { children, isOpen } = props;

    return (
        <motion.div
            animate={{ height: isOpen ? 'auto' : 0 }}
            className={styles.queryBuilder}
            initial={{ height: 0 }}
        >
            <ScrollArea>{children}</ScrollArea>
        </motion.div>
    );
}
interface PlayButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onClick: () => void;
}

function PlayButton(props: PlayButtonProps) {
    const { disabled, isLoading, onClick } = props;

    return (
        <IconButton
            iconFill
            isCompact
            className={styles.playButton}
            icon={isLoading ? 'spinner' : 'mediaPlay'}
            isDisabled={disabled}
            isLoading={isLoading}
            variant="primary"
            onClick={onClick}
        />
    );
}

ListHeader.Left = Left;
ListHeader.Right = Right;
ListHeader.Title = Title;
ListHeader.Footer = Footer;
ListHeader.ItemCount = ItemCount;
ListHeader.QueryBuilder = QueryBuilder;
ListHeader.PlayButton = PlayButton;
