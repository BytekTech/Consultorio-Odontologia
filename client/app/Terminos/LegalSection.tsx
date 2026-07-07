export interface Subsection {
  id: string;
  subtitle: string;
  items: string[];
}

export interface LegalDataProps {
  id: string;
  title: string;
  description: string;
  subsections: Subsection[];
}

interface Props {
  data: LegalDataProps;
}

export const LegalSection = ({ data }: Props) => {
  return (
    <section className="section">
      <h2>{data.title}</h2>
      
      {data.description && <p className="description">{data.description}</p>}
      
      {data.subsections?.map((sub) => (
        <div key={sub.id} className="subsection">
          <h3>{sub.subtitle}</h3>
          <ul>
            {sub.items?.map((item, index) => (
              <li key={`item-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};