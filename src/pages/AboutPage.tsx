import { useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import BackToTop from '../components/BackToTop';

const AboutPage = () => {
  useEffect(() => {
    // Set the page title
    document.title = 'About Me | IK.AM';
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-4 mb-12 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-amber-600 to-amber-400 dark:from-yellow-400 dark:to-yellow-300 bg-clip-text text-transparent">
          About Me
        </h1>

        <Card className="mb-10 overflow-hidden border border-amber-200/20 dark:border-yellow-400/20 shadow-xl dark:shadow-yellow-400/5">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 p-6 bg-amber-50 dark:bg-gray-800/50 flex items-center justify-center">
                <img 
                  src="https://avatars.githubusercontent.com/u/106908?s=200" 
                  alt="Toshiaki Maki" 
                  className="rounded-full w-48 h-48 border-4 border-amber-200 dark:border-yellow-400 shadow-lg"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Toshiaki Maki / 槙 俊明</h2>
                <p className="text-muted-foreground mb-6">
                  has a dog 🐩 (<a href="https://en.wikipedia.org/wiki/Bichon_Frise" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-yellow-400 hover:underline">Bichon Frise</a>). 
                  Lemon 🍋 is her name-o :)
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <a 
                    href="https://x.com/making" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-yellow-400 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Twitter size={18} />
                    <span>@making</span>
                  </a>
                  <a 
                    href="https://github.com/making" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-yellow-400 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Github size={18} />
                    <span>@making</span>
                  </a>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-yellow-400">
                    <Mail size={18} />
                    <span>makingx [at] gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b border-amber-200 dark:border-yellow-400/30 pb-2">
            Work Experience
          </h2>
          
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">Broadcom</h3>
              <p className="text-sm text-muted-foreground mb-2">Dec 2023 - Present</p>
              <p className="text-foreground">Senior Principal Architect (P6), Tokyo</p>
              <a 
                href="https://www.broadcom.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline"
              >
                www.broadcom.com
              </a>
            </div>
            
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">VMware</h3>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Aug 2022 - Dec 2023</p>
                <p className="text-foreground">Senior Staff Cloud Native Architect (P6), Tokyo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Apr 2020 - Jul 2022</p>
                <p className="text-foreground">Staff Cloud Native Architect (P5), Tokyo</p>
              </div>
              <a 
                href="https://vmware.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline mt-2 inline-block"
              >
                vmware.com
              </a>
            </div>
            
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">Pivotal</h3>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Sep 2018 - Apr 2020</p>
                <p className="text-foreground">Advisory Solutions Architect (P5), Tokyo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Jan 2016 - Aug 2018</p>
                <p className="text-foreground">Senior Solutions Architect (P4), Tokyo</p>
              </div>
              <a 
                href="https://pivotal.io/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline mt-2 inline-block"
              >
                pivotal.io
              </a>
            </div>
            
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">NTT DATA</h3>
              <p className="text-sm text-muted-foreground mb-2">Apr 2009 - Dec 2015</p>
              <p className="text-foreground">Assistant Manager, Tokyo</p>
              <a 
                href="https://www.nttdata.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline"
              >
                www.nttdata.com
              </a>
            </div>
          </div>
        </section>
        
        {/* Education */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b border-amber-200 dark:border-yellow-400/30 pb-2">
            Education
          </h2>
          
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">The University of Tokyo</h3>
              <p className="text-sm text-muted-foreground mb-2">Apr 2007 - Mar 2009</p>
              <p className="text-foreground">MS, Mechano-Informatics</p>
              <a 
                href="https://www.i.u-tokyo.ac.jp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline"
              >
                www.i.u-tokyo.ac.jp
              </a>
            </div>
            
            <div className="relative pl-8 border-l-2 border-amber-200 dark:border-yellow-400/30">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-yellow-400"></div>
              <h3 className="text-xl font-semibold text-foreground">The University of Tokyo</h3>
              <p className="text-sm text-muted-foreground mb-2">Apr 2003 - Mar 2007</p>
              <p className="text-foreground">BS, Mechano-Informatics</p>
              <a 
                href="https://www.u-tokyo.ac.jp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-amber-600 dark:text-yellow-400 hover:underline"
              >
                www.u-tokyo.ac.jp
              </a>
            </div>
          </div>
        </section>
      </div>
      <BackToTop />
    </>
  );
};

export default AboutPage;
