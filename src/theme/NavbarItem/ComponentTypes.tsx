import ComponentTypesObject from '@theme/NavbarItem/ComponentTypes';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import AdminNavbarItem from './AdminNavbarItem';
import CVNavbarItem from './CVPageLinkNavbarItem';
import GitHubLinksNavbarItem from './GitHubLinksNavbarItem';
import NavBarLinksNavbarItem from './NavBarLinksNavbarItem';
import PortfolioNavbarItem from './PortfolioPageLinkNavbarItem';
import ProjectsNavbarItem from './ProjectsPageLinkNavbarItem';
import ReaderModeNavbarItem from './ReaderModeNavbarItem';
import TextSizeSwitcherNavbarItem from './TextSizeSwitcherNavbarItem';
import ThemeSwitcherNavbarItem from './ThemeSwitcherNavbarItem';
import VersionDisplayNavbarItem from './VersionDisplayNavbarItem';

// If '@theme/NavbarItem/ComponentTypes' exports a value, use typeof for the type annotation
const ComponentTypes: typeof ComponentTypesObject = {
  default: DefaultNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  'custom-Admin': AdminNavbarItem,
  'custom-CV': CVNavbarItem,
  'custom-GitHubLinks': GitHubLinksNavbarItem,
  'custom-NavBarLinks': NavBarLinksNavbarItem,
  'custom-Portfolio': PortfolioNavbarItem,
  'custom-Projects': ProjectsNavbarItem,
  'custom-ReaderMode': ReaderModeNavbarItem,
  'custom-TextSizeSwitcher': TextSizeSwitcherNavbarItem,
  'custom-ThemeSwitcher': ThemeSwitcherNavbarItem,
  'custom-VersionDisplay': VersionDisplayNavbarItem
};

export default ComponentTypes;
