# 📝 Testimonial CMS

## Project Brief

**Business Sector:** Edtech

**Client Need:** Institutions and companies with active communities need to showcase the impact of their programs or products through real stories. The client is looking for a CMS specialized in collecting, organizing, and publishing testimonials in various formats (text, video, image) with curation, moderation, and engagement analytics features.

**Objective:** To build a specialized CMS for managing and publishing testimonials and success stories for websites and institutions.

## Features

### Functional Requirements

- Creation and editing of testimonials with text, image, and video.
- Categorization by type (product, event, client, industry).
- Embeds and a public API to integrate testimonials into other websites.
- Moderation and review system before publication.
- Smart tagging and search system.

### Technical Requirements

- Integration with YouTube and Cloudinary APIs for multimedia handling.
- User Roles: Admin, Editor, and Visitor.
- Documented REST API for external consumption.
- Built with Next.js for a modern web application framework.
- Utilizes a monorepo structure for efficient development and management of multiple projects.
- Database integration for storing testimonial data (e.g., PostgreSQL, MongoDB).
- Authentication and authorization mechanisms for secure access control.

## Deliverables

- Functional CMS with an administration dashboard.
- Comprehensive API documentation.
- Demonstration of integration on an external site.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn (npm recommended)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/TestimonialCMS-WebApp-Monorepo.git
    cd TestimonialCMS-WebApp-Monorepo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4.  **Environment Variables:**

    Create a `.env.local` file in the root directory and add necessary environment variables, such as API keys for Cloudinary, YouTube, and database connection strings. Consult `CONTRIBUTING.md` for more details.

## Contributing

We welcome contributions to the Testimonial CMS! Please see the `CONTRIBUTING.md` file for details on how to get started.
