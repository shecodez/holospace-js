import React from 'react';
import { Accordion } from 'semantic-ui-react';

// components
import Tabs from './../layouts/Tabs';
import Pane from './../layouts/Pane';

class Customization extends React.Component {
	state = {
		bodyOpts: ['builds', 'skin', 'arms', 'legs', 'hands', 'feet', 'measurments'],
		headOpts: [
			'face',
			'ears',
			'hairstyles',
			'beard',
			'eyebrows',
			'eyes',
			'lips',
			'adjustments'
		],
		wearOpts: ['head', 'neck', 'chest', 'back', 'legs', 'hands', 'feet', 'dyes']
	};

	render() {
		const { bodyOpts, headOpts, wearOpts } = this.state;
		return (
			<div className="user-model-customization">
				<Tabs selected={0}>
					<Pane label="Body">
						<Accordion
							defaultActiveIndex={0}
							panels={bodyOpts.map((option, i) => ({
								title: option,
								content: [i].join(' ')
							}))}
						/>
					</Pane>

					<Pane label="Head">
						<Accordion
							defaultActiveIndex={0}
							panels={headOpts.map((option, i) => ({
								title: option,
								content: [i].join(' ')
							}))}
						/>
					</Pane>

					<Pane label="Wardrobe">
						<Accordion
							defaultActiveIndex={0}
							panels={wearOpts.map((option, i) => ({
								title: option,
								content: [i].join(' ')
							}))}
						/>
					</Pane>
				</Tabs>
			</div>
		);
	}
}

export default Customization;
