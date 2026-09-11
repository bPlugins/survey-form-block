import { Outlet, Link, useLocation } from 'react-router-dom';

import Header from '../../../../bpl-tools/Admin/Header';

const navigation = [
	{ name: 'Welcome', href: '/welcome' },
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Feature Comparison', href: '/feature-comparison' },
	{ name: 'Activation', href: '/activation' }
];

const Layout = (props) => {
	const { isPremium, hasPro } = props;
	const location = useLocation();

	return (
		<div className="bPlDashboard">
			<Header {...props}>
				<nav className="bPlDashboardNav">
					{navigation
						// Activation only exists on the premium build.
						?.filter(item => item.href !== '/activation' || hasPro)
						// Upgrade paths are noise once the licence is active.
						?.filter(item => !isPremium || !['/purchase', '/pricing', '/feature-comparison'].includes(item.href))
						?.map((item, index) => (
							<Link
								key={index}
								to={item.href}
								className={`navLink ${location.pathname === item.href ? 'active' : ''}`}
							>
								{item.name}
							</Link>
						))}
				</nav>
			</Header>

			<main className="bPlDashboardMain">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
