import { Code, Github, Twitter, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl ml-2">FZScripts</span>
            </div>
            <p className="text-base text-muted-foreground">
              A community-driven platform for sharing, discovering, and collaborating on scripts for various applications and platforms.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Guides
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Community Forum
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                      Code of Conduct
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; 2023 FZScripts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
