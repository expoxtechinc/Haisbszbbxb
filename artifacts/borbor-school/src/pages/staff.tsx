import { motion } from "framer-motion";
import { useSchoolData } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Seo } from "@/components/seo";

export default function Staff() {
  const { schoolInfo, staff } = useSchoolData();

  // Separate leadership (Principal, Vice Principal) from teachers
  const leadership = staff.filter(s => s.role.toLowerCase().includes("principal"));
  const teachers = staff.filter(s => !s.role.toLowerCase().includes("principal"));

  const StaffCard = ({ member, index }: { member: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden group bg-card">
        <div className="aspect-[4/5] overflow-hidden bg-muted relative">
          {member.photoDataUrl ? (
            <img 
              src={member.photoDataUrl} 
              alt={member.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
              <span className="font-serif text-8xl font-bold">{member.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold font-serif text-foreground mb-1">{member.name}</h3>
          <p className="text-secondary font-medium">{member.role}</p>
          {member.bio && <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );

  const personSchemas = staff
    .filter((m) => m.name && m.role)
    .map((m) => ({
      name: m.name,
      jobTitle: m.role,
      image: m.photoDataUrl,
      description: m.bio,
    }));

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`Our Staff & Leadership — ${schoolInfo.name} (DASBMSE)`}
        description={`Meet the principal, vice principal, and dedicated teachers of Dr. Abraham S. Borbor Memorial School Of Excellence in Mount Barclay, Lower Johnsonville, Liberia.`}
        path="/staff"
        schoolInfo={schoolInfo}
        breadcrumbs={[
          { name: "Home", url: "https://dasbmsoe-official.vercel.app/" },
          { name: "Staff & Leadership", url: "https://dasbmsoe-official.vercel.app/staff" },
        ]}
        persons={personSchemas}
      />
      <section className="bg-primary pt-20 pb-24 text-center px-4 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Our Dedicated Team
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Meet the inspiring educators and administrators who make DASBMSE a center of excellence.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-10">
        
        {leadership.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-primary">School Leadership</h2>
              <div className="w-24 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {leadership.map((member, i) => (
                <StaffCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>
        )}

        {teachers.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-primary">Teaching Faculty</h2>
              <div className="w-24 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((member, i) => (
                <StaffCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}