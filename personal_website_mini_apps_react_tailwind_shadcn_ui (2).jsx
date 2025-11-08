import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Globe, Smartphone, CheckCircle2, Plus, Trash2, CalendarDays, FileText, ExternalLink, Send } from "lucide-react";

// ---------- Utilities ----------
const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 }
  }
};

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-16">
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </section>
  );
}

// ---------- Mini App: Task Tracker ----------
function TaskTracker() {
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [text, setText] = useState("");

  const remaining = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Task Tracker</CardTitle>
        <CardDescription>Quickly jot tasks and track progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { setTasks(prev => [...prev, { id: Date.now(), text: text.trim(), done: false }]); setText(""); }}}
          />
          <Button onClick={() => { if (text.trim()) { setTasks(prev => [...prev, { id: Date.now(), text: text.trim(), done: false }]); setText(""); } }}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <Separator />
        <ul className="space-y-2">
          {tasks.length === 0 && <p className="text-muted-foreground">No tasks yet. Add your first one!</p>}
          {tasks.map(t => (
            <li key={t.id} className="flex items-center justify-between p-2 rounded-xl border">
              <label className="flex items-center gap-3">
                <input
                  aria-label={`toggle ${t.text}`}
                  type="checkbox"
                  className="h-4 w-4"
                  checked={t.done}
                  onChange={() => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                />
                <span className={"text-sm " + (t.done ? "line-through text-muted-foreground" : "")}>{t.text}</span>
              </label>
              <Button variant="ghost" size="icon" onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="text-sm text-muted-foreground">{remaining} remaining</div>
      </CardContent>
    </Card>
  );
}

// ---------- Mini App: Notes (Markdown-lite) ----------
function NotesApp() {
  const [notes, setNotes] = useState<string>("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Markdown Notes</CardTitle>
        <CardDescription>Write notes; export or copy when ready.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea rows={10} placeholder="# Meeting notes\n- item 1\n- item 2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={() => navigator.clipboard.writeText(notes)}>Copy</Button>
          <Button variant="secondary" onClick={() => {
            const blob = new Blob([notes], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "notes.md"; a.click();
            URL.revokeObjectURL(url);
          }}>Download .md</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Contact Form (client-side demo) ----------
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your API route later
    console.log({ name, email, message });
    setSent(true);
  };

  if (sent) return (
    <Card>
      <CardHeader>
        <CardTitle>Thanks!</CardTitle>
        <CardDescription>I'll get back to you soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setSent(false)}>Send another message</Button>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5" /> Contact</CardTitle>
        <CardDescription>Drop a message and your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Textarea rows={5} placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------- Main Site ----------
export default function PersonalSite() {
  const projects = [
    {
      title: "Mini Task Tracker",
      desc: "A simple task manager with progress counts.",
      href: "#apps",
      icon: CheckCircle2
    },
    {
      title: "Markdown Notes",
      desc: "Fast notes with copy & download.",
      href: "#apps",
      icon: FileText
    },
    {
      title: "Portfolio Website",
      desc: "This site—clean, fast, responsive.",
      href: "#",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-background/60 border-b">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#home" className="font-bold tracking-tight text-xl">Md. Wali Ullah</a>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#research" className="hover:underline">Research</a>
            <a href="#teaching" className="hover:underline">Teaching</a>
            <a href="#publications" className="hover:underline">Publications</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#apps" className="hover:underline">Apps</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><a href="#contact"><Mail className="h-4 w-4 mr-1"/> Contact</a></Button>
            <Button asChild size="sm" variant="secondary"><a href="https://github.com" target="_blank" rel="noreferrer"><Github className="h-4 w-4 mr-1"/> GitHub</a></Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <Section id="home" title="Hi, I'm Md. Wali Ullah" subtitle="PhD Candidate • Teaching & Research • UC Merced">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Welcome to my corner of the internet. Below you'll find some of my projects and a couple of mini apps I built just for fun.
            </p>
            <div className="flex gap-3">
              <Button asChild><a href="#projects">View Projects</a></Button>
              <Button asChild variant="outline"><a href="#apps">Try Apps</a></Button>
            </div>
            <div className="flex gap-2 pt-2">
              <Badge>React</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Tailwind</Badge>
              <Badge>shadcn/ui</Badge>
              <Badge>Framer Motion</Badge>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.1 }} className="rounded-3xl border p-6 shadow-sm">
            <div className="aspect-video rounded-2xl border flex items-center justify-center text-center">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Portfolio Boilerplate</h3>
                <p className="text-sm text-muted-foreground mt-2">Drop in your bio, links, and projects. Ready for Vercel/Netlify.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              <div className="p-3 border rounded-xl">
                <CalendarDays className="h-4 w-4" />
                <p className="mt-2 text-muted-foreground">Book meetings</p>
              </div>
              <div className="p-3 border rounded-xl">
                <Smartphone className="h-4 w-4" />
                <p className="mt-2 text-muted-foreground">Responsive</p>
              </div>
              <div className="p-3 border rounded-xl">
                <ExternalLink className="h-4 w-4" />
                <p className="mt-2 text-muted-foreground">SEO-ready</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="About Me" subtitle="Short bio, skills, and what you’re looking for.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Who I Am</CardTitle>
              <CardDescription>Replace with your story.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                I'm a PhD candidate in Applied Mathematics at UC Merced who loves building smooth, accessible interfaces and turning research ideas into working products. I enjoy shipping fast while keeping things accessible and reliable.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Core toolbelt</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {"React TypeScript Next.js Node Tailwind Prisma PostgreSQL Python Docker".split(" ").map(s => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Featured Projects" subtitle="A quick selection. Link out to live demos and repos.">
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <p.icon className="h-5 w-5" />
                  <CardTitle>{p.title}</CardTitle>
                </div>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={p.href}>Open <ExternalLink className="h-4 w-4 ml-2" /></a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Apps */}
      <Section id="apps" title="Try the Apps" subtitle="Built-in mini tools. Add your own easily.">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="tasks">Task Tracker</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <TabsContent value="tasks" className="md:col-span-1"><TaskTracker /></TabsContent>
            <TabsContent value="notes" className="md:col-span-1"><NotesApp /></TabsContent>
          </div>
        </Tabs>
      </Section>

      {/* Research */}
      <Section id="research" title="Research" subtitle="Modeling, machine learning, and applied mathematics for real‑world impact.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Interests</CardTitle><CardDescription>Focus areas</CardDescription></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {"Machine Learning Mathematical Biology Computational Modeling Time-series Analysis Numerical Analysis Computer Vision Statistics Probability PDEs".split(" ").map(s => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Open to collaboration</CardTitle><CardDescription>Students & researchers</CardDescription></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Interested in joint projects in ML for public health, time‑series methods, and data‑driven modeling.</CardContent>
          </Card>
        </div>
      </Section>

      {/* Teaching */}
      <Section id="teaching" title="Teaching" subtitle="Courses, office hours, and materials.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Recent Roles</CardTitle><CardDescription>University appointments</CardDescription></CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li><strong>Graduate Teaching Assistant</strong>, UC Merced — Aug 2025–Present</li>
                <li><strong>Lecturer</strong>, BAIUST — Dec 2024–Mar 2025</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Office Hours</CardTitle><CardDescription>By appointment</CardDescription></CardHeader>
            <CardContent className="text-sm">
              ACS 358B · <a className="underline" href="mailto:mdwaliullah@ucmerced.edu">mdwaliullah@ucmerced.edu</a>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Publications */}
      <Section id="publications" title="Publications" subtitle="Selected works.">
        <Card><CardContent>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Unveiling the future:</strong> Wavelet‑ARIMAX analysis of climate and diarrhea dynamics in Bangladesh’s urban centers. <em>BMC Public Health</em>, Jan 24, 2025.</li>
            <li><strong>Clinically adaptable machine learning model</strong> to identify early appreciable features of diabetes. <em>Intelligent Medicine</em>.</li>
          </ul>
          <div className="mt-4"><Button asChild variant="outline"><a href="https://scholar.google.com/citations?hl=en&user=zl-WLmcAAAAJ" target="_blank" rel="noreferrer">View on Google Scholar</a></Button></div>
        </CardContent></Card>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Get in Touch" subtitle="Email works best, but DMs are open.">
        <div className="grid md:grid-cols-2 gap-6">
          <ContactForm />
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>Where to find me</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a className="inline-flex items-center gap-2 hover:underline" href="mailto:mdwaliullah@ucmerced.edu"><Mail className="h-4 w-4" /> mdwaliullah@ucmerced.edu</a>
              <a className="inline-flex items-center gap-2 hover:underline" href="https://github.com/yourname" target="_blank" rel="noreferrer"><Github className="h-4 w-4" /> github.com/yourname</a>
              <a className="inline-flex items-center gap-2 hover:underline" href="https://www.linkedin.com/in/waliullah1/" target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> LinkedIn</a>
              <a className="inline-flex items-center gap-2 hover:underline" href="https://appliedmath.ucmerced.edu/content/md-wali-ullah" target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /> UC Merced Profile</a>
            </CardContent>
          </Card>
        </div>
      </Section>

      <footer className="py-10 border-t">
        <div className="max-w-6xl mx-auto px-4 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} Md. Wali Ullah. All rights reserved.</p>
          <a className="hover:underline inline-flex items-center" href="#home">Back to top</a>
        </div>
      </footer>
    </div>
  );
}
