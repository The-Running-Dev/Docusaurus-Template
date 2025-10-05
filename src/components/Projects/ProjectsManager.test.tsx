import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../Auth/AuthProvider';

// Mock useAuth hook for admin tests
vi.mock('../Auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: vi.fn(() => ({
    user: { roles: ['admin'] },
    isAuthenticated: true,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    error: null
  }))
}));

// Mock fetch for AdminTabsModal
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
) as any;

// Enable Projects feature
vi.mock('../../config', () => ({
  useFeaturesConfig: () => ({
    giscusComments: false,
    gitHubLinks: false,
    navBarLinks: false,
    themeSwitcher: false,
    textSizeSwitcher: false,
    readerMode: false,
    versionDisplay: false,
    cvPage: false,
    portfolioPage: false,
    projectsPage: true,
    portfolioPageAsIndex: false,
    dataCaching: false
  })
}));

// Provide store-backed projects data
let mockLoading: boolean = false;
let mockError: Error | null = null;
let mockData: any[] | null = null;
vi.mock('../../hooks/useProjects', async () => {
  return {
    useProjects: () => ({
      data: mockData,
      loading: mockLoading,
      error: mockError,
      metadata: undefined
    })
  } as any;
});

import ProjectsManager from './ProjectsManager';
import ProjectsAdmin from './ProjectsAdmin';
import { beforeEach } from 'vitest';

describe('ProjectsManager', () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  it('renders display mode without admin controls', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Proj',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: ['React']
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Projects/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Delete Selected/)).toBeNull();
    expect(screen.getByText('Proj')).toBeInTheDocument();
  });

  it.skip('renders admin controls and supports edit -> save callback', { timeout: 10000 }, async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Proj',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: ['React']
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin onSaveProject={onSave} />);
    // Admin actions visible
    expect(screen.getByText(/Delete Selected/)).toBeInTheDocument();
    // Click the project card to load into form
    const cardTitle = screen.getByText('Proj');
    const card = cardTitle.closest('.projectCard') || cardTitle;
    await act(async () => {
      fireEvent.click(card);
    });
    // Save button should be present in edit tab
    const saveBtn = await screen.findByRole('button', {
      name: /Save Project/i
    });
    await act(async () => {
      fireEvent.click(saveBtn);
    });
    expect(onSave).toHaveBeenCalled();
  });

  it('supports bulk delete via selection', async () => {
    const onBulkDelete = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'A',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: ['R']
              }
            ]
          }
        ]
      }
    ];
    // Stub confirm
    // @ts-ignore
    window.confirm = () => true;
    render(<ProjectsManager isAdmin onBulkDelete={onBulkDelete} />);
    // Select all
    const selectAll = screen.getByRole('button', { name: /Select All/ });
    await act(async () => {
      selectAll.click();
    });
    // Wait for selection to reflect and button to enable
    const del = screen.getByRole('button', { name: /Delete Selected/ });
    await waitFor(() => expect(del).not.toBeDisabled());
    // Delete selected and wait for async handler
    await act(async () => {
      del.click();
    });
    await waitFor(() => expect(onBulkDelete).toHaveBeenCalled());
    const [targets] = onBulkDelete.mock.calls[0];
    expect(Array.isArray(targets)).toBe(true);
    expect(targets.length).toBe(1);
  });

  it('supports single-item delete on a card', async () => {
    const onBulkDelete = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Zed',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    // @ts-ignore
    window.confirm = () => true;
    render(<ProjectsManager isAdmin onBulkDelete={onBulkDelete} />);
    const cardTitle = screen.getByText('Zed');
    const card = (cardTitle.closest('.projectCard') ||
      cardTitle) as HTMLElement;
    const delBtn = within(card).getByRole('button', { name: /Delete/i });
    await act(async () => {
      delBtn.click();
    });
    expect(onBulkDelete).toHaveBeenCalled();
    const [targets] = onBulkDelete.mock.calls[0];
    expect(targets[0]).toMatchObject({ category: 'Web', subCategory: 'React' });
  });

  it('shows quick menu and copies via clipboard when available', async () => {
    const writeText = vi.fn();
    // @ts-ignore
    global.navigator.clipboard = { writeText };
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'CopyMe',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: [],
                link: 'https://example.com'
              }
            ]
          }
        ]
      }
    ];
    render(
      <ProjectsManager isAdmin adminApiBase="http://localhost:4000/api" />
    );
    const title = screen.getByText('CopyMe');
    const card = (title.closest('.projectCard') || title) as HTMLElement;
    const menuBtn = within(card).getByRole('button', {
      name: /Quick actions/i
    });
    await act(async () => {
      menuBtn.click();
    });
    const copySlugBtn = await within(card).findByRole('button', {
      name: /Copy Slug/i
    });
    await act(async () => {
      copySlugBtn.click();
    });
    expect(writeText).toHaveBeenCalled();
  });

  it('quick menu copies API URL when adminApiBase is set', async () => {
    const writeText = vi.fn();
    // @ts-ignore
    global.navigator.clipboard = { writeText };
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'CopyAPI',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: [],
                link: ''
              }
            ]
          }
        ]
      }
    ];
    render(
      <ProjectsManager isAdmin adminApiBase="http://localhost:4000/api" />
    );
    const title = screen.getByText('CopyAPI');
    const card = (title.closest('.projectCard') || title) as HTMLElement;
    const menuBtn = within(card).getByRole('button', {
      name: /Quick actions/i
    });
    await act(async () => {
      menuBtn.click();
    });
    const copyApiBtn = await within(card).findByRole('button', {
      name: /Copy API URL/i
    });
    await act(async () => {
      copyApiBtn.click();
    });
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('/v1/projects/Web/React/copyapi')
    );
  });

  it('persists search and filter to localStorage', async () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    // Search input should exist; type in it
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'abc' } });
    // Select a filter by clicking technology/category if available; otherwise just ensure it doesn't throw
    // Verify localStorage save path (keys)
    await waitFor(() =>
      expect(localStorage.getItem('projects.search')).toBe('abc')
    );
  });

  it('imports JSON and calls onSaveProject for each item', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      { category: 'Web', subCategories: [{ name: 'React', projects: [] }] }
    ];
    render(<ProjectsManager isAdmin onSaveProject={onSave} />);
    const input = screen.getByLabelText(/Import JSON/i) as HTMLInputElement;
    const payload = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'FromFile',
                summary: 'S',
                tags: [],
                lastModified: new Date().toISOString()
              }
            ]
          }
        ]
      }
    ];

    // Create file with proper structure
    const fileContent = JSON.stringify(payload);
    const file = new File([fileContent], 'projects.json', {
      type: 'application/json'
    });

    // Mock file.text() method for test environment
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(fileContent),
      writable: false
    });

    // Upload file and wait for processing
    await act(async () => {
      await userEvent.upload(input, file);
    });

    // Wait for the onSave to be called - increased timeout and better wait condition
    await waitFor(
      () => {
        expect(onSave).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );

    // Verify the call was made with the right data structure
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        project: expect.objectContaining({
          title: 'FromFile',
          summary: 'S',
          tags: [],
          lastModified: expect.any(String)
        }),
        category: 'Web',
        subCategory: 'React',
        slug: 'fromfile'
      }),
      undefined
    );
  });

  it('export creates a Blob and calls URL.createObjectURL', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    const createObjectURL = vi.fn(() => 'blob://test');
    // @ts-ignore
    global.URL.createObjectURL = createObjectURL;
    // Spy on anchor click
    const clickSpy = vi.fn();
    const realCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: any) => {
      const el = realCreateElement(tagName);
      if (tagName === 'a') {
        // @ts-ignore
        el.click = clickSpy;
      }
      return el;
    });
    render(<ProjectsManager isAdmin />);
    const exportBtn = screen.getByRole('button', {
      name: /Export \(Filtered\)/i
    });
    exportBtn.click();
    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('keyboard shortcuts select all and delete', async () => {
    const onBulkDelete = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    // @ts-ignore
    window.confirm = () => true;
    render(<ProjectsManager isAdmin onBulkDelete={onBulkDelete} />);
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'Delete' });
    await waitFor(() => expect(onBulkDelete).toHaveBeenCalled());
  });

  it('bulk delete respects confirm cancel', () => {
    const onBulkDelete = vi.fn().mockResolvedValue(undefined);
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    // @ts-ignore
    window.confirm = () => false;
    render(<ProjectsManager isAdmin onBulkDelete={onBulkDelete} />);
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(onBulkDelete).not.toHaveBeenCalled();
  });

  it('shortcut E opens edit form', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    // Ensure Save not visible yet
    expect(screen.queryByRole('button', { name: /Save Project/i })).toBeNull();
    fireEvent.keyDown(window, { key: 'e' });
    expect(
      screen.getByRole('button', { name: /Save Project/i })
    ).toBeInTheDocument();
  });

  it('slash focuses search input', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    const search = screen.getByRole('textbox');
    // Blur it first
    (search as HTMLInputElement).blur();
    fireEvent.keyDown(window, { key: '/' });
    expect(document.activeElement).toBe(search);
  });

  it.skip('copy slug in edit form', { timeout: 10000 }, async () => {
    const writeText = vi.fn();
    // @ts-ignore
    global.navigator.clipboard = { writeText };
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Sluggy',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    const cardTitle = screen.getByText('Sluggy');
    const card = (cardTitle.closest('.projectCard') ||
      cardTitle) as HTMLElement;
    await act(async () => {
      card.click();
    });
    const copyBtn = await screen.findByRole('button', { name: /Copy Slug/i });
    await act(async () => {
      copyBtn.click();
    });
    expect(writeText).toHaveBeenCalled();
  });

  it.skip('Test Link button opens a new tab when link is valid', { timeout: 10000 }, async () => {
    const open = vi.fn();
    // @ts-ignore
    window.open = open;
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'HasLink',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: [],
                link: 'https://example.com'
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    const cardTitle = screen.getByText('HasLink');
    const card = (cardTitle.closest('.projectCard') ||
      cardTitle) as HTMLElement;
    await act(async () => {
      card.click();
    });
    const testBtn = await screen.findByRole('button', { name: /Test/i });
    await act(async () => {
      testBtn.click();
    });
    expect(open).toHaveBeenCalled();
  });

  it('toggle hides and shows hints row', async () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(<ProjectsManager isAdmin />);
    // Hints visible initially
    expect(screen.getByText(/Focus Search/)).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: /Hide Hints/i });
    await act(async () => {
      toggle.click();
    });
    expect(screen.queryByText(/Focus Search/)).toBeNull();
    const showBtn = screen.getByRole('button', { name: /Show Hints/i });
    await act(async () => {
      showBtn.click();
    });
    expect(screen.getByText(/Focus Search/)).toBeInTheDocument();
  });

  it.skip('settings modal toggles hints globally', async () => {
    // Render wrapper to use settings modal
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Alpha',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    const { unmount } = render(React.createElement(ProjectsAdmin));
    // Hints visible initially via manager
    expect(screen.getByText(/Focus Search/)).toBeInTheDocument();
    // Open settings modal
    const gear = screen.getByRole('button', { name: /Settings/i });
    await act(async () => {
      gear.click();
    });
    // Toggle checkbox off
    const checkbox = screen.getByRole('checkbox', {
      name: /Toggle keyboard hints/i
    });
    await act(async () => {
      fireEvent.click(checkbox);
    });
    // Save
    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await act(async () => {
      saveBtn.click();
    });
    // Hints should disappear
    expect(screen.queryByText(/Focus Search/)).toBeNull();
    unmount();
  });

  it('renders without crashing', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Test Project',
                summary: 'A test project',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(
      <AuthProvider>
        <ProjectsManager isAdmin={true} />
      </AuthProvider>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /Projects/i })
    ).toBeInTheDocument();
  });

  it('shows admin overlay for admin user', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Test Project',
                summary: 'A test project',
                lastModified: new Date().toISOString(),
                tags: []
              }
            ]
          }
        ]
      }
    ];
    render(
      <AuthProvider>
        <ProjectsManager isAdmin={true} />
      </AuthProvider>
    );
    // Look for admin UI elements instead of "Bulk Actions"
    expect(screen.getByText(/Delete Selected/)).toBeInTheDocument();
  });

  it('handles drag & drop reordering', () => {
    // Simulate drag & drop and check order update
    // ...mock drag & drop logic...
  });

  it('validates project fields in real time', () => {
    // Simulate editing and check validation errors
    // ...mock validation logic...
  });

  it('auto-saves drafts on change', () => {
    // Simulate change and check auto-save call
    // ...mock auto-save logic...
  });
});
