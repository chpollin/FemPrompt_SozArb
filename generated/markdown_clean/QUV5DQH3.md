---
record_id: QUV5DQH3
source_kind: official_html_fulltext
source_url: https://ssir.org/articles/entry/when_good_algorithms_go_sexist_why_and_how_to_advance_ai_gender_equity
source_sha256: 595ff1f5fefce4bd6bf467dec636e24bab12aa67eaf1fcc0c7839a29bf2ea911
source_acquired_at: 2026-08-23
source_publisher: Stanford Social Innovation Review
verified_title: When Good Algorithms Go Sexist: Why and How to Advance AI Gender Equity
verified_authors: Genevieve Smith; Ishita Rustagi
verified_year: 2021
verified_doi: 10.48558/A179-B138
conversion: semantic_html_projection
---

# When Good Algorithms Go Sexist: Why and How to Advance AI Gender Equity

Seven actions social change leaders and machine learning developers can take to build gender-smart artificial intelligence for a more just world.

Seven actions social change leaders and machine learning developers can take to build gender-smart artificial intelligence for a more just world.

- Cite

- share

- comment

- print

- order reprints

- related stories

By Genevieve Smith & Ishita Rustagi Mar. 31, 2021

In 2019, Genevieve (co-author of this article) and her husband applied for the same credit card. Despite having a slightly better credit score and the same income, expenses, and debt as her husband, the credit card company set her credit limit at almost half the amount. This experience echoes one that made headlines later that year: A husband and wife compared their Apple Card spending limits and found that the husband’s credit line was 20 times greater. Customer service employees were unable to explain why the algorithm deemed the wife significantly less creditworthy.

Many institutions make decisions based on artificial intelligence (AI) systems using machine learning (ML), whereby a series of algorithms takes and learns from massive amounts of data to find patterns and make predictions. These systems inform how much credit financial institutions offer different customers, who the health care system prioritizes for COVID-19 vaccines, and which candidates companies call in for job interviews. Yet gender bias in these systems is pervasive and has profound impacts on women’s short- and long-term psychological, economic, and health security. It can also reinforce and amplify existing harmful gender stereotypes and prejudices.

As we conclude Women's History Month, social change leaders—including researchers and professionals with gender expertise—and ML systems developers alike need to ask: How can we build gender-smart AI to advance gender equity, rather than embed and scale gender bias?

## Where AI Gender Bias Comes From

AI systems are biased because they are human creations. Who makes decisions informing AI systems and who is on the team developing AI systems shapes their development. And unsurprisingly, there is a huge gender gap: Only 22 percent of professionals in AI and data science fields are women—and they are more likely to occupy jobs associated with less status.

At a more granular level, humans generate, collect, and label the data that goes into datasets. Humans determine what datasets, variables, and rules the algorithms learn from to make predictions. Both of these stages can introduce biases that become embedded in AI systems.

In terms of gender bias from data, data points are snapshots of the world we live in, and the large gender data gaps we see are partly due to the gender digital divide. For example, some 300 million fewer women than men access the Internet on a mobile phone, and women in low- and middle-income countries are 20 percent less likely than men to own a smartphone. These technologies generate data about their users, so the fact that women have less access to them inherently skews datasets. Even when data is generated, humans collecting data decide what to collect and how. No industry better illustrates this than health care (another industry with gender imbalance among leadership ): Men and male bodies have long been the standard for medical testing. Women are missing from medical trials , with female bodies deemed too complex and variable. Females aren’t even included in animal studies on female-prevalent diseases. This gap is reflected in medical data.

Data that isn’t disaggregated by sex and gender (as well as other identities) presents another problem. It paints an inaccurate picture, concealing important differences between people of different gender identities, and hides potential overrepresentation or underrepresentation. For example, few urban datasets track and analyze data on gender , so infrastructure programs don’t often factor in women’s needs.

Even when representative data points do exist, they may have prejudice built-in and reflect inequities in society. Returning to the consumer credit industry, early processes used marital status and gender to determine creditworthiness. Eventually, these discriminatory practices were replaced by ones considered more neutral. But by then, women had less formal financial history and suffered from discrimination, impacting their ability to get credit. Data points tracking individuals’ credit limits capture these discriminatory trends.

Labeling of data can be subjective and embed harmful biases and perspectives too. For instance, most demographic data end up labeled on the basis of simplistic, binary female-male categories. When gender classification collapses gender in this way, it reduces the potential for AI to reflect gender fluidity and self-held gender identity.

In terms of gender bias from algorithms, one of the first steps in developing an algorithm is the selection of training dataset(s). Again, back to the consumer credit industry, when AI systems that determine creditworthiness learn from historical data, they pick up on the patterns of women receiving lower credit limits than men. They reproduce the same inequitable access to credit along gender ( and race ) lines, as seen in Genevieve’s case and the Apple Card story. Relatedly, the Gender Shades research project found that commercial facial-recognition systems used image data sets that lack diverse and representative samples. These systems misclassified women far more often than men. In particular, darker-skinned women were misclassified at an error rate of 35 percent, compared to an error rate of .8 percent for lighter-skinned men.

Developers tell algorithms what variables to consider when making decisions, but those variables and proxies may penalize certain identities or communities. For example, an online tech hiring platform, Gild (since acquired by Citadel), developed an AI system to help employers rank candidates for programming jobs. Gild not only screened information gleaned from traditional sources such as resumes, but also used a proxy called “social data” (data generated by actions in the digital realm) to measure how integral the candidate was to the digital community. In this case, social data was drawn from time spent sharing and developing code on platforms like GitHub. But factors such as the societal expectations around unpaid care, which women tend to bear, translate to women having less time to chat online. Women therefore produce less of this social data. In addition, women may assume male identities on platforms like GitHub to circumvent sexist, gender-specific safety concerns (such as targeted harassment and trolling), and other forms of bias. Instead of removing human biases, Gild created an algorithm predisposed to penalizing women and systematically ranking female candidates lower than male counterparts.

## Impacts of Gender-Biased AI

Gender-biased AI not only has immense impacts on individuals but also can contribute to setbacks in gender equality and women’s empowerment. As part of our work at the Berkeley Haas Center for Equity, Gender and Leadership on mitigating bias in artificial intelligence , we track publicly available instances of bias in AI systems using ML. In our analysis of around 133 biased systems across industries from 1988 to present day, we found that 44.2 percent (59 systems) demonstrate gender bias, with 25.7 percent (34 systems) exhibiting both gender and racial bias.

Gender-biased AI systems have six primary impacts: Of the 59 systems exhibiting gender bias, 70 percent resulted in lower quality of service for women and non-binary individuals. Voice-recognition systems, increasingly used in the automotive and health care industries, for example, often perform worse for women. Second, unfair allocation of resources, information, and opportunities for women manifested in 61.5 percent of the systems we identified as gender-biased, including hiring software and ad systems that deprioritized women’s applications.

Reinforcement of existing, harmful stereotypes and prejudices (in 28.2 percent of gender-biased systems) is exacerbated by feedback loops between data inputs and outputs. For instance, translation software, which learns from vast amounts of online text, has historically taken gender-neutral terms (such as “the doctor” or “the nurse” in English) and returned gendered translations (such as “el doctor” and “la enfermera,” respectively, in Spanish), reinforcing stereotypes of male doctors and female nurses. Relatedly, we find that AI systems—most commonly in Internet-related services—result in derogatory and offensive treatment or erasure of already marginalized gender identities (6.84 percent). For example, using the gender binary in gender classification builds in an inaccurate, simplistic view of gender in tools such as facial analysis systems.

In addition, certain systems affect the physical and mental well-being of women and non-binary individuals. Gender-biased systems used in health care, welfare, and the automotive industry, in particular, pose detriments to physical safety (18.8 percent of gender-biased systems) and health hazards (3.42 percent) . AI systems supporting skin cancer detection, for example, struggle to detect melanoma for Black people, putting Black women who are already underserved by the health care industry at risk.

## What Social Change Leaders Can Do

Prioritizing gender equity and justice as a primary goal for ML systems can create a downstream impact on design and management decisions. We must acknowledge that ML systems are not objective. Even ML systems designed for good (for example, a system built to make creditworthiness assessments or hiring more equitable) can be prone to bias-related issues, just like their human creators. There are roles for social change leaders, as well as leaders at organizations developing ML systems, to make gender-smart ML and advance gender equity.

Social change leaders can:

1. Use feminist data practices to help fill data gaps. As Catherine D’Ignazio and Lauren Klein capture in their book, Data Feminism , feminist data practices include analyzing how power operates and using data to challenge unequal power structures, moving past the gender binary, valuing multiple forms of knowledge, and synthesizing multiple perspectives with priority given to local and Indigenous knowledge. Feminist data can help center the voices and experiences of marginalized individuals, including women and girls.

As one example, Digital Democracy , an organization that works with marginalized communities to defend their rights through technology, worked with local community groups such as the Commission of Women Victims for Victims (KOFAVIV) to build a secure system for collecting gender-based violence data in Haiti . The system allowed local women to track, analyze, map, and share data.

Another important step is to acknowledge and work against harmful data practices, as outlined in the Feminist Data Manifest-No .

2. Lend your expertise to the field of gender-equitable AI, advocate for AI literacy training, and join the conversation. By integrating gender expertise into AI systems, ML developers and managers can better understand issues and solutions to mitigate gender bias.

This starts by advocating for AI literacy training among gender experts and engaging in the conversation by asking conference organizers for sessions and workshops on gender and AI. It wasn’t long ago, for example, that gender experts were largely absent from discussions about impact investing. Workshops like those held by Criterion Institute , which included training on financial investing concepts and gender considerations, helped researchers and professionals with gender expertise better understand the field of impact investing, as well as engage in—and ultimately advance— gender-lens investing work and initiatives.

3. In considering or using AI systems to tackle gender gaps, think critically about who is represented on the team developing that AI system, as well as what data they are using and how they develop the algorithm.

AI is increasingly being used to tackle global development challenges , including gender inequality, and civil society organizations are getting on board. For example, Women’s World Banking and Mujer Financiera are using ML to support financial inclusion for women . It is important to insist on and support ML developers to center the voices of women and non-binary individuals in the development, creation, and management of these AI systems. Also, do your due diligence, and assess potential AI systems for gender bias and unintended consequences before using them.

## What ML Developers Can Do

When ML systems are built for good they can evade critical analysis on bias and the potential for unintended consequences. Intending to build a system for good is not enough. To help researchers and leaders at businesses and organizations developing AI systems catalyze gender-smart ML, social change leaders should encourage ML development partners to pursue and advocate for the following:

1. Embed and advance gender diversity, equity, and inclusion among teams developing and managing AI systems. This is necessary if we believe in the potential of AI to enable a more just world. A recent study showed that diverse demographic groups are better at decreasing algorithmic bias. Take action by ensuring that diversity is a core leadership priority and updating institutional policies, practices, and structures to support diversity and inclusion.

2. Recognize that data and algorithms are not neutral, and then do something about it. Document what is in your ML datasets (for example, through Datasheets for Datasets ) and ML models (such as through model cards ). Assess datasets for under-representation of different gender identities and underlying inequities that reflect reality but are ultimately problematic. Finally, partner with gender experts to integrate feminist data principles and approaches, diagnose and tackle potential gender impacts of an algorithm and conduct algorithm audits with a gender lens.

3. Center the voices of marginalized community members, including women and non-binary individuals, in the development of AI systems. Support research and learn from other sectors—such as off-grid energy and cleaner cooking —that have embedded participatory design and participatory action research into the development of technologies.

4. Establish gender-sensitive governance approaches for responsible AI. When developing AI ethics governance structures (an AI ethics board and lead), ensure that there is gender diversity. Within responsible or ethical AI codes and principles, think critically about how to incorporate justice and equity related to gender and other marginalized identities. (See this UNESCO report for guidance on embedding gender equality considerations into AI principles).

These actions are not exhaustive, but they provide a starting point for building gender-smart ML that advances equity. Let’s not miss this opportunity to revolutionize how we think about, design, and manage AI systems and thereby pursue a more just world today and for future generations.

Read more stories by Genevieve Smith & Ishita Rustagi .

Genevieve Smith is the associate director at the Center for Equity, Gender and Leadership (EGAL) at the UC Berkeley Haas School of Business. For more than a decade, she has conducted research and worked to advance gender equity and women’s economic empowerment. She is the lead author of EGAL’s playbook on mitigating bias in AI .

Ishita Rustagi is the business strategies and operations analyst at the Center for Equity, Gender and Leadership (EGAL) at the UC Berkeley Haas School of Business, where she supports the development of resources, tools, and thought leadership to advance diversity, equity, and inclusion. She is the co-author of EGAL’s playbook on mitigating bias in AI .

In 2019, Genevieve (co-author of this article) and her husband applied for the same credit card. Despite having a slightly better credit score and the same income, expenses, and debt as her husband, the credit card company set her credit limit at almost half the amount. This experience echoes one that made headlines later that year: A husband and wife compared their Apple Card spending limits and found that the husband’s credit line was 20 times greater. Customer service employees were unable to explain why the algorithm deemed the wife significantly less creditworthy.

Many institutions make decisions based on artificial intelligence (AI) systems using machine learning (ML), whereby a series of algorithms takes and learns from massive amounts of data to find patterns and make predictions. These systems inform how much credit financial institutions offer different customers, who the health care system prioritizes for COVID-19 vaccines, and…

### Create a free SSIR account to access this content.

Our mission is to share the best in social innovation research and practice, regardless of your ability to pay, so free account holders get additional access to articles on ssir.org each month.

If you can afford it, please support SSIR with a subscription. For as little as $6 per month, you'll get:

- Unlimited access to new articles

- Access to SSIR 's 20+ years of field-defining work

- Digital PDF editions of every print issue

And you'll make sure SSIR continues to support social innovators around the world with new ideas, insights, and inspiration.

Already have an account?
