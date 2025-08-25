import { BookOpen, Users, Award } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: BookOpen,
      value: "50,000+",
      label: "Books Available",
    },
    {
      icon: Users,
      value: "100,000+",
      label: "Happy Readers",
    },
    {
      icon: Award,
      value: "15+",
      label: "Years of Excellence",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
