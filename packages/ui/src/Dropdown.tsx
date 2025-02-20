import { ReactComponent as CaretDown } from '@sd/assets/svgs/caret.svg';
import { Menu, Transition } from '@headlessui/react';
import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import { Fragment, PropsWithChildren, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import * as UI from '.';
import { tw } from './utils';

export const Section = tw.div`px-1 py-1 space-y-[2px]`;

const itemStyles = cva(
	'group mb-[3px] flex w-full shrink-0 grow items-center whitespace-nowrap rounded px-2 py-1 text-sm font-medium disabled:opacity-50',
	{
		variants: {
			selected: {
				true: 'bg-accent text-white hover:!bg-accent',
				undefined: 'hover:bg-menu-hover',
				false: 'hover:bg-menu-hover'
			},
			active: {
				true: ''
			}
		}
	}
);

const itemIconStyles = cva('mr-2 h-4 w-4', {
	variants: {}
});

type DropdownItemProps = PropsWithChildren<{
	to?: string;
	className?: string;
	icon?: any;
	onClick?: () => void;
}> &
	VariantProps<typeof itemStyles>;

export const Item = ({ to, className, icon: Icon, children, ...props }: DropdownItemProps) => {
	const content = (
		<>
			{Icon && <Icon weight="bold" className={itemIconStyles(props)} />}
			<span className="text-left">{children}</span>
		</>
	);
	return (
		<Menu.Item>
			{to ? (
				<Link {...props} to={to} className={clsx(itemStyles(props), className)}>
					{content}
				</Link>
			) : (
				<button {...props} className={clsx(itemStyles(props), className)}>
					{content}
				</button>
			)}
		</Menu.Item>
	);
};

export const Button = forwardRef<HTMLButtonElement, UI.ButtonProps>(
	({ children, className, ...props }, ref) => {
		return (
			<UI.Button
				size="sm"
				ref={ref}
				className={clsx('group flex text-left', className)}
				{...props}
			>
				{children}
				<span className="grow" />
				<CaretDown
					className="ml-2 w-[12px] shrink-0 translate-y-[1px] text-ink-dull transition-transform ui-open:translate-y-[-1px] ui-open:rotate-180 group-radix-state-open:translate-y-[-1px] group-radix-state-open:rotate-180"
					aria-hidden="true"
				/>
			</UI.Button>
		);
	}
);

export interface DropdownRootProps {
	button: React.ReactNode;
	className?: string;
	itemsClassName?: string;
	align?: 'left' | 'right';
}

export const Root = (props: PropsWithChildren<DropdownRootProps>) => {
	return (
		<div className={props.className}>
			<Menu as="div" className={clsx('relative flex w-full text-left')}>
				<Menu.Button as="div" className="flex-1 outline-none">
					{props.button}
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition duration-100 ease-out"
					enterFrom="transform -translate-y-2 opacity-0"
					enterTo="transform translate-y-0 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform translate-y-0 opacity-100"
					leaveTo="transform -translate-y-2 opacity-0"
				>
					<Menu.Items
						className={clsx(
							'absolute top-full z-50 w-full min-w-fit divide-y divide-menu-line rounded-md border border-menu-line bg-menu text-menu-ink shadow-xl shadow-menu-shade/30 focus:outline-none',
							props.itemsClassName,
							{ 'left-0': props.align === 'left' },
							{ 'right-0': props.align === 'right' }
						)}
					>
						{props.children}
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};
