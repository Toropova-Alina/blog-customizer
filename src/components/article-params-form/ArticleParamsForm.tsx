import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	ArticleStateType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from '../../constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
interface ArticleParamsFormProps {
	initialParams: ArticleStateType;
	onSubmit: (params: ArticleStateType) => void;
	onReset: () => void;
}

export const ArticleParamsForm = ({
	initialParams,
	onSubmit,
	onReset,
}: ArticleParamsFormProps) => {
	const [formState, setFormState] = useState<ArticleStateType>(initialParams);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const asideRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setFormState(initialParams);
	}, [initialParams]);

	useEffect(() => {
		if (!isFormOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				setIsFormOpen(false);
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsFormOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isFormOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formState);
		setIsFormOpen(false);
	};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		onReset();
		setIsFormOpen(false);
	};

	const handleChange =
		<K extends keyof ArticleStateType>(key: K) =>
		(value: ArticleStateType[K]) => {
			setFormState((prev) => ({
				...prev,
				[key]: value,
			}));
		};

	return (
		<>
			<ArrowButton
				isOpen={isFormOpen}
				onClick={() => setIsFormOpen(!isFormOpen)}
			/>
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div className={styles.settingsContainer}>
						<Text weight={800} size={31} uppercase>
							Задайте параметры
						</Text>
						<Select
							title='Шрифт'
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={handleChange('fontFamilyOption')}></Select>

						<RadioGroup
							name={formState.fontSizeOption.title}
							title='Размер шрифта'
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={handleChange('fontSizeOption')}></RadioGroup>

						<Select
							title='Цвет шрифта'
							selected={formState.fontColor}
							options={fontColors}
							onChange={handleChange('fontColor')}></Select>

						<Separator />

						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={handleChange('backgroundColor')}></Select>

						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={handleChange('contentWidth')}></Select>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
