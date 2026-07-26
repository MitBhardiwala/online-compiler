export interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export interface NavLink {
  id: string;
  title: string;
}

export interface FooterLink {
  name: string;
  link: string;
}

export interface SocialMediaLink {
  id: string;
  icon: string;
  link: string;
} 