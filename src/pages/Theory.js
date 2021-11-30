import { useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Theory({ setOpen, setInAnalysisPage }) {
  useEffect(() => {
    setInAnalysisPage(false);
    setOpen(false);
  }, []);

  return (
    <Paper sx={{ margin: 'auto', maxWidth: '1200px' }}>
      <Typography variant='h3' sx={{ padding: 3, paddingBottom: 0 }}>
        Theory page
      </Typography>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography variant='h6'>Concept 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
            officiis incidunt! Error, vitae. Facilis aperiam tenetur molestiae
            animi velit nihil, laboriosam iste consequuntur ab. Ipsa, pariatur
            quo hic ratione adipisci amet quibusdam eius quisquam. Laboriosam
            odio voluptatum odit eius quo. Aperiam, nostrum perferendis? Iusto
            sit labore eveniet, provident sequi consectetur quis explicabo
            mollitia temporibus tempora asperiores. Animi nostrum dicta sapiente
            dolorem nulla distinctio reiciendis? Saepe voluptates ea debitis
            asperiores nam illo similique quidem! Delectus aut aperiam
            consequuntur eveniet excepturi sapiente numquam similique
            dignissimos, sit dolor id fuga vel illum optio eligendi cumque,
            blanditiis illo debitis placeat dolorum commodi incidunt molestias!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography variant='h6'>Concept 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo
            inventore ab soluta molestias ad tempora libero, fuga cupiditate
            totam magni nisi voluptatibus, corporis omnis! Aut explicabo, error
            quasi enim perspiciatis facilis quibusdam magnam, provident eos
            cumque consectetur necessitatibus ipsam ipsum! Nobis, exercitationem
            sit? Nulla explicabo assumenda suscipit sequi repudiandae cupiditate
            quos libero ab excepturi sapiente accusamus voluptatum minima rerum,
            consequuntur quasi commodi dolorem eveniet cumque exercitationem!
            Numquam maxime porro magnam ipsam? Ex molestiae autem rem dicta
            iusto harum. Nam hic rem odio sed esse! Accusamus minus, laudantium
            omnis aliquam est nobis ipsa tenetur nihil quia rem voluptatum
            nesciunt doloribus, odit quasi nostrum. Maxime architecto quo
            exercitationem quis repellat corrupti doloribus odit dolorum itaque
            nisi ut quisquam natus, accusamus fugit voluptate harum at sed
            repellendus eveniet iusto enim expedita totam dicta? Ratione,
            quaerat! Vero porro velit nobis fuga? Quia, omnis ad. At odio
            incidunt obcaecati, corporis, dolore neque alias, omnis facere ad
            laborum vel animi culpa. Veniam tempore, veritatis quis neque rem
            illo consequuntur aliquam ad obcaecati ipsam vitae tenetur itaque
            temporibus dolor nisi cumque fugit? Suscipit porro totam, nemo illo
            unde tempora eius, blanditiis repudiandae laboriosam adipisci quasi!
            Consequatur, accusamus laborum officiis rerum placeat magni deserunt
            ut impedit! Facere, illum!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3a-content'
          id='panel3a-header'
        >
          <Typography variant='h6'>Concept 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            \Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
            alias ullam in sed id iusto molestias vitae natus iure quae
            repudiandae numquam voluptates necessitatibus, veniam perferendis
            error sit ipsum dolor, nihil laboriosam voluptatum impedit tempora?
            Quibusdam expedita pariatur molestias nemo, eaque, fugit nihil culpa
            fugiat, ullam vero natus. Deleniti fuga unde dolorem asperiores
            ipsam laudantium harum rem fugiat quas fugit.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
