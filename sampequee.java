import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jms.core.JmsTemplate;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class JmsproducerTest {

    @Mock
    private JmsTemplate mockJmsTemplate;

    @InjectMocks
    private Jmsproducer jmsproducer;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testJmsTemplateAutowired() throws NoSuchFieldException, IllegalAccessException {
        // Get the field using reflection
        Field field = Jmsproducer.class.getDeclaredField("jmstemplate");
        field.setAccessible(true);

        // Assert that the field is not null after autowiring
        assertNotNull(field.get(jmsproducer), "JmsTemplate should be autowired");
    }
}
